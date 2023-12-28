import { Module } from '@nestjs/common';
import { BitfinexService } from './external/bitfinex.service';
import { HttpAdapterService } from './http-adapter/http-adapter.service';

@Module({
  imports: [],
  providers: [BitfinexService, HttpAdapterService],
  exports: [BitfinexService, HttpAdapterService],
})
export class SharedModule {}
