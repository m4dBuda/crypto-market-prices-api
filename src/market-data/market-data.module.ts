import { Module, forwardRef } from '@nestjs/common';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';
import { PrismaClient } from '@prisma/client';
import { SharedModule } from 'src/shared/shared.module';
import { HttpAdapterService } from 'src/shared/http-adapter/http-adapter.service';
import { BitfinexService } from 'src/shared/external/bitfinex.service';

@Module({
  imports: [forwardRef(() => SharedModule)],
  controllers: [MarketDataController],
  providers: [MarketDataService, PrismaClient, HttpAdapterService, BitfinexService],
})
export class MarketDataModule {}
