import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { Point } from 'geojson';
import { createStoreDto } from './dto/create-store.dto';
import { getDistanceFromLatLonInKm } from '../helpers/helper';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(store: createStoreDto) {
    const pointObject: Point = {
      type: 'Point',
      coordinates: [store.long, store.lat],
    };

    const newStore = new Store();

    newStore.name = store.name;
    newStore.address = store.address;
    newStore.lat = store.lat;
    newStore.long = store.long;
    newStore.location = pointObject;

    return await this.storeRepository.save(newStore);
  }

  getAll() {
    return this.storeRepository.find();
  }

  async getByRange(lat: number, long: number, range: number) {
    range = range || 1000;

    const userpos: Point = {
      type: 'Point',
      coordinates: [long, lat],
    };

    const stores = await this.storeRepository
      .createQueryBuilder('store')
      .select([
        'store.name AS name',
        'ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:userpos), ST_SRID(location)))/1000 as distance',
      ])
      .where(
        'ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:userpos), ST_SRID(location)), :range)',
      )
      .orderBy('distance', 'ASC')
      .setParameters({
        userpos: JSON.stringify(userpos),
        range: range * 1000,
      })
      .getRawMany();

    return stores;
  }

  async getByRangeWithoutExt(lat: number, long: number, range: number) {
    range = range || 1000;
    const stores: any = await this.storeRepository.find({
      select: {
        id: true,
        name: true,
        lat: true,
        long: true,
      },
    });

    const filteredStores = stores
      .filter((store: any) => {
        const distance = getDistanceFromLatLonInKm(
          lat,
          long,
          store.lat,
          store.long,
        );

        return distance <= range;
      })
      .map((store: any) => {
        store.distance = getDistanceFromLatLonInKm(
          lat,
          long,
          store.lat,
          store.long,
        );

        return store;
      });

    const sorted = filteredStores.sort(
      (a: any, b: any) => a.distance - b.distance,
    );

    return sorted;
  }
}
