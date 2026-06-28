import { TossClient, type TossInvestOptions } from './client.js'
import { AccountModule } from './modules/account.js'
import { AssetModule } from './modules/asset.js'
import { MarketDataModule } from './modules/market-data.js'
import { OrderModule } from './modules/order.js'

export class TossInvest extends TossClient {
  public accounts: AccountModule
  public assets: AssetModule
  public markets: { data: MarketDataModule }
  public orders: OrderModule

  constructor(options: TossInvestOptions) {
    super(options)

    this.accounts = new AccountModule(this.http)
    this.assets = new AssetModule(this.http)
    this.markets = {
      data: new MarketDataModule(this.http),
    }
    this.orders = new OrderModule(this.http)
  }
}
