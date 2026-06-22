import type ky from 'ky'

export type AccountType = 'BROKERAGE' | 'OVERSEAS_DERIVATIVES' | 'PENSION_SAVINGS' | 'RESHORING_INVESTMENT'

export interface Account {
  accountNo: string
  accountSeq: number
  accountType: AccountType
}

export class AccountModule {
  constructor(private http: typeof ky) {}

  async list(): Promise<Account[]> {
    const { result } = await this.http.get('api/v1/accounts').json<{ result: Account[] }>()
    return result
  }
}
