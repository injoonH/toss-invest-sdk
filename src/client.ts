import ky from 'ky'

export interface TossInvestOptions {
  clientId: string
  clientSecret: string
}

interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: 'Bearer'
}

export class TossClient {
  protected http: typeof ky
  private clientId: string
  private clientSecret: string

  private accessToken: string | null = null
  private tokenExpiresAt: Temporal.Instant | null = null

  private readonly BASE_URL = 'https://openapi.tossinvest.com'
  private readonly AUTH_PATH = 'oauth2/token'

  constructor(options: TossInvestOptions) {
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret

    this.http = ky.create({
      baseUrl: this.BASE_URL,
      hooks: {
        beforeRequest: [
          async ({ request }) => {
            if (request.url.includes(this.AUTH_PATH)) return

            const token = await this.getValidToken()
            request.headers.set('Authorization', `Bearer ${token}`)
          },
        ],
        afterResponse: [
          async ({ request, response }) => {
            if (response.status === 401 && !request.url.includes(this.AUTH_PATH)) {
              this.accessToken = null
              const newToken = await this.getValidToken()
              request.headers.set('Authorization', `Bearer ${newToken}`)
            }
          },
        ],
      },
    })
  }

  private async getValidToken(): Promise<string> {
    const now = Temporal.Now.instant()

    if (this.accessToken && this.tokenExpiresAt) {
      const threshold = this.tokenExpiresAt.subtract({ seconds: 60 })
      const isBefore = Temporal.Instant.compare(now, threshold) < 0

      if (isBefore) {
        return this.accessToken
      }
    }

    const search = new URLSearchParams()
    search.set('grant_type', 'client_credentials')
    search.set('client_id', this.clientId)
    search.set('client_secret', this.clientSecret)

    const res = await ky.post(this.AUTH_PATH, { baseUrl: this.BASE_URL, body: search }).json<TokenResponse>()

    this.accessToken = res.access_token
    this.tokenExpiresAt = now.add({ seconds: res.expires_in })

    return this.accessToken
  }
}
