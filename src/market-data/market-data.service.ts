import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient, marketPrice } from '@prisma/client';

import { CreateMarketDataDto } from './dto/create-market-data.dto';
import { BitfinexService } from 'src/shared/external/bitfinex.service';

import { PairEnum } from './enums/pair.enum';
import { OrderInterface } from './interfaces/order.interface';
import { MarketDataInterface } from './interfaces/market-data.interface';

@Injectable()
export class MarketDataService {
  constructor(private readonly prisma: PrismaClient, private readonly bitfinex: BitfinexService) {}

  public async fetchMarketData(pair: PairEnum): Promise<MarketDataInterface> {
    if (!pair) {
      throw new HttpException('Pair is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response: number[][] = await this.bitfinex.getBook(pair);
      const buyOrders = response.filter((order) => order[2] > 0);
      const sellOrders = response.filter((order) => order[2] < 0);

      if (buyOrders.length === 0 || sellOrders.length === 0) {
        throw new HttpException('No buy or sell orders found', HttpStatus.NOT_FOUND);
      }

      const bid: OrderInterface = this.getBestOrder(buyOrders);
      const ask: OrderInterface = this.getBestOrder(sellOrders);

      const marketPrice = (bid.price + ask.price) / 2;

      return { bid, ask, marketPrice, pair };
    } catch (error) {
      throw new HttpException(`Failed to fetch market data: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private getBestOrder(orders: number[][]): OrderInterface {
    orders.sort((a, b) => b[0] - a[0]);
    return { price: orders[0][0], count: orders[0][1], amount: orders[0][2] };
  }

  public async saveMarketData(createMarketDataDto: CreateMarketDataDto): Promise<marketPrice> {
    try {
      const { pair, price } = createMarketDataDto;
      return await this.prisma.marketPrice.create({
        data: {
          pair: pair,
          price: price,
        },
      });
    } catch (error) {
      throw new HttpException('Failed to save market data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getHistoricMarketData(pair: PairEnum): Promise<marketPrice[]> {
    try {
      return await this.prisma.marketPrice.findMany({
        where: { pair: pair },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      throw new HttpException('Failed to get historic market data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
