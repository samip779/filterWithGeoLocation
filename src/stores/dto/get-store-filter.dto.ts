import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from 'class-validator';

export class getStoreFilterDto {
  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  long: number;

  @IsNotEmpty()
  @IsNumber()
  range: number;
}
