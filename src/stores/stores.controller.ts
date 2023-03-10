import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// import { createStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';

import { createStoreDto } from './dto/create-store.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() store: createStoreDto) {
    return this.storesService.create(store);
  }

  @Get()
  getAll() {
    return this.storesService.getAll();
  }

  @Get('range')
  getByRange(@Query() query: { lat: number; long: number; range: number }) {
    return this.storesService.getByRangeWithoutExt(
      +query.lat,
      +query.long,
      +query.range,
    );
  }
}
