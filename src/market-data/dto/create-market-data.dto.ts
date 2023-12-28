import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMarketDataDto {
  @IsNotEmpty()
  @IsString()
  pair: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
