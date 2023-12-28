import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MarketDataModule } from './market-data/market-data.module';

@Module({
  imports: [MarketDataModule],
  controllers: [],
  providers: [PrismaClient],
})
export class AppModule {}
