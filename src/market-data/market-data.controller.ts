import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { CreateMarketDataDto } from './dto/create-market-data.dto';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get(':pair')
  async getMarketData(@Param('pair') pair: string) {
    try {
      const { bid, ask, marketPrice } = await this.marketDataService.fetchMarketData(pair);
      const createMarketDataDto = new CreateMarketDataDto();
      createMarketDataDto.pair = pair;
      createMarketDataDto.price = marketPrice;
      await this.marketDataService.saveMarketData(createMarketDataDto);
      return { bid, ask, marketPrice };
    } catch (error) {
      throw new HttpException('Failed to get market data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('historic/:pair')
  async getHistoricMarketData(@Param('pair') pair: string) {
    try {
      const historicMarketPrice = await this.marketDataService.getHistoricMarketData(pair);
      return historicMarketPrice;
    } catch (error) {
      throw new HttpException('Failed to get historic market data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
