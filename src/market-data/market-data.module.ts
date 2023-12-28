import { Module } from '@nestjs/common';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [MarketDataController],
  providers: [MarketDataService, PrismaClient],
})
export class MarketDataModule {}
