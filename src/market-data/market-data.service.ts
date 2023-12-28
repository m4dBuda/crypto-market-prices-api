import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient, marketPrice } from '@prisma/client';
import { CreateMarketDataDto } from './dto/create-market-data.dto';
import { HttpAdapterService } from 'src/shared/external/bitfinex.service';
import { Order } from './interfaces/order.interface';
import { Pair } from './enums/pair.enum';

@Injectable()
export class MarketDataService {
  constructor(private readonly prisma: PrismaClient, private readonly HttpAdapterService: HttpAdapterService) {}

  public async fetchMarketData(pair: Pair): Promise<{ bid: Order; ask: Order; marketPrice: number; pair: Pair }> {
    if (!pair) {
      throw new HttpException('Pair is required', HttpStatus.BAD_REQUEST);
    }

    const url = `https://api-pub.bitfinex.com/v2/book/${pair}/P0`;
    const len = 25;

    try {
      const response: number[][] = await this.HttpAdapterService.get(`${url}?len=${len}`);

      const buyOrders = response.filter((order) => order[2] > 0);
      const sellOrders = response.filter((order) => order[2] < 0);

      if (buyOrders.length === 0 || sellOrders.length === 0) {
        throw new HttpException('No buy or sell orders found', HttpStatus.NOT_FOUND);
      }

      buyOrders.sort((a, b) => b[0] - a[0]);
      sellOrders.sort((a, b) => a[0] - b[0]);

      const bid: Order = { price: buyOrders[0][0], count: buyOrders[0][1], amount: buyOrders[0][2] };
      const ask: Order = { price: sellOrders[0][0], count: sellOrders[0][1], amount: sellOrders[0][2] };

      const marketPrice = (bid.price + ask.price) / 2;

      return { bid, ask, marketPrice, pair };
    } catch (error) {
      throw new HttpException(`Failed to fetch market data: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  public async getHistoricMarketData(pair: string): Promise<marketPrice[]> {
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
