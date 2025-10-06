import { Inject, Injectable } from '@nestjs/common';
import { LocationDto } from '~/location/location.dto';
import { CacheHandlerInterface } from '~/common/cache/cache-handler.interface';
import { LocationSearchResultDto } from '~/location/location-search-result.dto';
import { GeocodeService } from '~/location/geocode.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocationDtoProvider {
  protected readonly cacheTtl: number;

  constructor(
    @Inject('CacheHandlerInterface') private cacheHandler: CacheHandlerInterface,
    private geocodeService: GeocodeService,
    private readonly config: ConfigService,
  ) {
    this.cacheTtl = this.config.get<number>('LOCATION_CACHE_TTL') ?? 84000;
  }

  async findByNameSearch(q: string): Promise<LocationDto> {
    let locationDto: LocationDto | null = null;

    // Find existing location in cache
    const searchResultDto = await this.cacheHandler.get<LocationSearchResultDto>(
      LocationSearchResultDto.keyFromValue(q),
      LocationSearchResultDto.fromObject,
    );

    if (!searchResultDto) {
      const data = await this.geocodeService.findLocationByNameSearch(q);

      locationDto = new LocationDto(data.id, data.name, data.latitude, data.longitude, data.country);

      await this.cacheHandler.set(new LocationSearchResultDto(q, data.id), this.cacheTtl);
      await this.cacheHandler.set(locationDto, this.cacheTtl);
    } else if (searchResultDto.locationId) {
      locationDto = await this.cacheHandler.get<LocationDto>(
        LocationDto.keyFromValue(searchResultDto.locationId),
        LocationDto.fromObject,
      );
    }

    if (!locationDto) {
      throw new Error(`Could not find location matching '${q}'`);
    }

    return locationDto;
  }
}
