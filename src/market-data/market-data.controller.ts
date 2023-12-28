import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { CreateMarketDataDto } from './dto/create-market-data.dto';
import { PairEnum } from './enums/pair.enum';
import { MarketDataInterface } from './interfaces/market-data.interface';
import { MarketDataEntity } from './entities/market-data.entity';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get(':pair')
  public async getMarketData(@Param('pair') pair: PairEnum): Promise<MarketDataInterface> {
    try {
      const { bid, ask, marketPrice } = await this.marketDataService.fetchMarketData(pair);
      const createMarketDataDto = new CreateMarketDataDto();
      createMarketDataDto.pair = pair;
      createMarketDataDto.price = marketPrice;
      await this.marketDataService.saveMarketData(createMarketDataDto);
      return { bid, ask, marketPrice, pair };
    } catch (error) {
      throw new HttpException('Failed to get market data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('historic/:pair')
  async getHistoricMarketData(@Param('pair') pair: PairEnum): Promise<MarketDataEntity[]> {
    try {
      const historicMarketPrice = await this.marketDataService.getHistoricMarketData(pair);
      return historicMarketPrice;
    } catch (error) {
      throw new HttpException('Failed to get historic market data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
