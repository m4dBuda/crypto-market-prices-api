import { Module } from '@nestjs/common';
import { MarketDataModule } from './market-data/market-data.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [MarketDataModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
