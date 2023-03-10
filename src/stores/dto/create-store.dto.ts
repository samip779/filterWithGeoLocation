import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class createStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  long: number;
}
