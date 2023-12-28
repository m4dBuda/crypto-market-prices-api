import { Injectable } from '@nestjs/common';
import { HttpAdapterService } from '../http-adapter/http-adapter.service';
import { PairEnum } from 'src/market-data/enums/pair.enum';

@Injectable()
export class BitfinexService {
  constructor(private readonly httpAdapterService: HttpAdapterService) {}

  public async getBook(pair: PairEnum): Promise<any> {
    const url = `https://api-pub.bitfinex.com/v2/book/${pair}/P0?len=25`;
    try {
      const response = await this.httpAdapterService.get(url);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
