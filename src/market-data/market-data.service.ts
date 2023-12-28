import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient, marketPrice } from '@prisma/client';
import { CreateMarketDataDto } from './dto/create-market-data.dto';
import { HttpAdapterService } from 'shared/http-adapter/http-adapter.service';

@Injectable()
export class MarketDataService {
  constructor(private readonly prisma: PrismaClient, private readonly httpAdapterService: HttpAdapterService) {
    this.httpAdapterService.setBaseURL(process.env.BITTREX_API_URL);
    this.httpAdapterService.setTimeout(10000);
  }

  public async fetchMarketData(pair: string): Promise<any> {
    try {
      const response = await this.httpAdapterService.get(`/getorderbook?market=${pair}&type=both`);
      const { result } = response;
      const bid = result.sell[0]; // best bid (highest price)
      const ask = result.buy[0]; // best ask (lowest price)
      const marketPrice = (bid.rate + ask.rate) / 2; // average of best bid and ask
      console.log(`Market price for ${pair}: ${marketPrice}`);
      console.log('result', result);
      return { bid, ask, marketPrice };
    } catch (error) {
      throw new HttpException('Failed to fetch market data', HttpStatus.INTERNAL_SERVER_ERROR);
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
