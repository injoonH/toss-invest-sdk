import type ky from 'ky'
import type { Currency } from './types.js'

export interface OrderbookEntry {
  price: string
  volume: string
}

export interface OrderbookResponse {
  asks: OrderbookEntry[]
  bids: OrderbookEntry[]
  currency: Currency
  timestamp: string | null
}

export interface PriceResponse {
  currency: Currency
  lastPrice: string
  symbol: string
  timestamp: string | null
}

export interface TradesOptions {
  symbol: string
  count?: number
}

export interface Trade {
  currency: Currency
  price: string
  timestamp: string
  volume: string
}

export class MarketDataModule {
  constructor(private http: typeof ky) {}

  async orderbook(symbol: string): Promise<OrderbookResponse> {
    const { result } = await this.http
      .get('api/v1/orderbook', {
        searchParams: { symbol },
      })
      .json<{ result: OrderbookResponse }>()
    return result
  }

  async prices(symbols: string[]): Promise<PriceResponse[]> {
    const symbol = symbols.join(',')
    const { result } = await this.http
      .get('api/v1/prices', {
        searchParams: { symbol },
      })
      .json<{ result: PriceResponse[] }>()
    return result
  }

  async trades(options: TradesOptions): Promise<Trade[]> {
    const { result } = await this.http
      .get('api/v1/trades', {
        searchParams: {
          symbol: options.symbol,
          count: options.count,
        },
      })
      .json<{ result: Trade[] }>()
    return result
  }
}
