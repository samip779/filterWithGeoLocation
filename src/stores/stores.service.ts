import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { Point } from 'geojson';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(location: any) {
    const pointObject: Point = {
      type: 'Point',
      coordinates: [location.long, location.lat],
    };

    location.location = pointObject;

    return await this.storeRepository.save(location);
  }
}
