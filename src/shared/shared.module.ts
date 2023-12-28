import { Module } from '@nestjs/common';
import { HttpAdapterService } from './external/bitfinex.service';

@Module({
  imports: [],
  providers: [HttpAdapterService],
  exports: [HttpAdapterService],
})
export class SharedModule {}
