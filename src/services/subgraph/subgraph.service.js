import Trades from './trade'

export default class SubgraphService {
  trades
  constructor() {
    this.trades = new Trades(this)
  }
}

export const subgraphService = new SubgraphService()
