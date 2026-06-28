import type ky from 'ky'
import type { Currency } from './types.js'

export type OrderType = 'LIMIT' | 'MARKET'

export type Side = 'BUY' | 'SELL'

export type TimeInForce = 'DAY' | 'CLS'

export interface OrderCreateQuantityBased {
  orderType: OrderType
  quantity: string
  side: Side
  symbol: string
  clientOrderId?: string
  confirmHighValueOrder?: boolean
  price?: string
  timeInForce: TimeInForce
}

export interface OrderCreateAmountBased {
  orderAmount: string
  orderType: 'MARKET'
  side: Side
  symbol: string
  clientOrderId?: string
  confirmHighValueOrder?: boolean
}

export type OrderCreateRequest = OrderCreateQuantityBased | OrderCreateAmountBased

export interface OrderResponse {
  orderId: string
  clientOrderId: string | null
}

export interface OrderModifyRequest {
  orderType: OrderType
  confirmHighValueOrder?: boolean
  price?: string
  quantity?: string
}

export interface OrderOperationResponse {
  orderId: string
}

export type OrderStatus =
  | 'PENDING'
  | 'PENDING_CANCEL'
  | 'PENDING_REPLACE'
  | 'PARTIAL_FILLED'
  | 'FILLED'
  | 'CANCELED'
  | 'REJECTED'
  | 'CANCEL_REJECTED'
  | 'REPLACE_REJECTED'
  | 'REPLACED'

export interface OrderExecution {
  averageFilledPrice: string
  commission: string
  filledAmount: string
  filledAt: string | null
  filledQuantity: string
  settlementDate: string | null
  tax: string
}

export interface Order {
  currency: Currency
  execution: OrderExecution
  orderedAt: string
  orderId: string
  orderType: OrderType
  quantity: string
  side: Side
  status: OrderStatus
  symbol: string
  timeInForce: TimeInForce
  canceledAt: string | null
  orderAmount: string | null
  price: string | null
}

export interface PaginatedOrderResponse {
  hasNext: boolean
  nextCursor: string | null
  orders: Order[]
}

export interface BuyingPowerResponse {
  cashBuyingPower: string
  currency: Currency
}

export interface SellableQuantityResponse {
  sellableQuantity: string
}

export type MarketCountry = 'KR' | 'US'

export interface Commission {
  commissionRate: string
  marketCountry: MarketCountry
  endDate: string | null
  startDate: string | null
}

export interface OrderCreateOptions {
  accountSeq: number
  request: OrderCreateRequest
}

export interface OrderModifyOptions {
  accountSeq: number
  orderId: string
  request: OrderModifyRequest
}

export interface OrderCancelOptions {
  accountSeq: number
  orderId: string
}

export interface OrderHistoryListOptions {
  accountSeq: number
  status: 'OPEN' | 'CLOSED'
  symbol?: string
  from?: string
  to?: string
  cursor?: string
  limit?: number
}

export interface OrderHistoryDetailOptions {
  accountSeq: number
  orderId: string
}

export interface BuyingPowerOptions {
  accountSeq: number
  currency: Currency
}

export interface SellableQuantityOptions {
  accountSeq: number
  symbol: string
}

export interface CommissionOptions {
  accountSeq: number
}

export class OrderModule {
  constructor(private http: typeof ky) {}

  async create(options: OrderCreateOptions): Promise<OrderResponse> {
    const { result } = await this.http
      .post('api/v1/orders', {
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
        json: options.request,
      })
      .json<{ result: OrderResponse }>()
    return result
  }

  async modify(options: OrderModifyOptions): Promise<OrderOperationResponse> {
    const { result } = await this.http
      .post(`api/v1/orders/${options.orderId}/modify`, {
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
        json: options.request,
      })
      .json<{ result: OrderOperationResponse }>()
    return result
  }

  async cancel(options: OrderCancelOptions): Promise<OrderOperationResponse> {
    const { result } = await this.http
      .post(`api/v1/orders/${options.orderId}/cancel`, {
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
      })
      .json<{ result: OrderOperationResponse }>()
    return result
  }

  async list(options: OrderHistoryListOptions): Promise<PaginatedOrderResponse> {
    const { accountSeq, ...searchParams } = options
    const { result } = await this.http
      .get('api/v1/orders', {
        searchParams,
        headers: {
          'X-Tossinvest-Account': String(accountSeq),
        },
      })
      .json<{ result: PaginatedOrderResponse }>()
    return result
  }

  async detail(options: OrderHistoryDetailOptions): Promise<Order> {
    const { result } = await this.http
      .get(`api/v1/orders/${options.orderId}`, {
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
      })
      .json<{ result: Order }>()
    return result
  }

  async buyingPower(options: BuyingPowerOptions): Promise<BuyingPowerResponse> {
    const { result } = await this.http
      .get('api/v1/buying-power', {
        searchParams: {
          currency: options.currency,
        },
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
      })
      .json<{ result: BuyingPowerResponse }>()
    return result
  }

  async sellableQuantity(options: SellableQuantityOptions): Promise<SellableQuantityResponse> {
    const { result } = await this.http
      .get('api/v1/sellable-quantity', {
        searchParams: {
          currency: options.symbol,
        },
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
      })
      .json<{ result: SellableQuantityResponse }>()
    return result
  }

  async commissions(options: CommissionOptions): Promise<Commission[]> {
    const { result } = await this.http
      .get('api/v1/commissions', {
        headers: {
          'X-Tossinvest-Account': String(options.accountSeq),
        },
      })
      .json<{ result: Commission[] }>()
    return result
  }
}
