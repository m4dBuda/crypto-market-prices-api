import { PairEnum } from '../enums/pair.enum';
import { OrderInterface } from './order.interface';

export interface MarketDataInterface {
  bid: OrderInterface;
  ask: OrderInterface;
  marketPrice: number;
  pair: PairEnum;
}
