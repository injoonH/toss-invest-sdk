import type ky from 'ky'
import type { Currency } from './types.js'

export interface Price {
  krw: string
  usd: string
}

export interface OverviewDailyProfitLoss {
  amount: Price
  rate: string
}

export interface Cost {
  commission: string
  tax: string | null
}

export interface DailyProfitLoss {
  amount: string
  rate: string
}

export type MarketCountry = 'KR' | 'US'

export interface MarketValue {
  amount: string
  amountAfterCost: string
  purchaseAmount: string
}

export interface ProfitLoss {
  amount: string
  amountAfterCost: string
  rate: string
  rateAfterCost: string
}

export interface HoldingsItem {
  averagePurchasaePrice: string
  cost: Cost
  currency: Currency
  dailyProfitLoss: DailyProfitLoss
  lastPrice: string
  marketCountry: MarketCountry
  marketValue: MarketValue
  name: string
  profitLoss: ProfitLoss
  quantity: string
  symbol: string
}

export interface OverviewMarketValue {
  amount: Price
  amountAfterCost: Price
}

export interface OverviewProfitLoss {
  amount: Price
  amountAfterCost: Price
  rate: string
  rateAfterCost: string
}

export interface HoldingsOverview {
  dailyProfitLoss: OverviewDailyProfitLoss
  items: HoldingsItem[]
  marketValue: OverviewMarketValue
  profitLoss: OverviewProfitLoss
  totalPurchaseAmount: Price
}

export interface AssetHoldingsOptions {
  accountSeq: number
  symbol?: string
}

export class AssetModule {
  constructor(private http: typeof ky) {}

  async holdings(options: AssetHoldingsOptions): Promise<HoldingsOverview> {
    const { result } = await this.http
      .get('api/v1/holdings', {
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
      })
      .json<{ result: HoldingsOverview }>()
    return result
  }
}
