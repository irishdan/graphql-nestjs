import { DtoInterface } from '~/common/dto/dto.interface';

export class LocationDto implements DtoInterface {
  static version = 1;

  constructor(
    public id: number,
    public name: string,
    public latitude: number,
    public longitude: number,
    public country: string,
  ) {}

  getKey() {
    return `LocationDto:${LocationDto.version}:${this.id}`;
  }

  static keyFromValue(id: number) {
    return `LocationDto:${LocationDto.version}:${id}`;
  }

  static fromObject(obj: object): LocationDto {
    if (
      'id' in obj &&
      typeof obj.id === 'number' &&
      'name' in obj &&
      typeof obj.name === 'string' &&
      'latitude' in obj &&
      typeof obj.latitude === 'number' &&
      'longitude' in obj &&
      typeof obj.longitude === 'number' &&
      'country' in obj &&
      typeof obj.country === 'string'
    ) {
      return new LocationDto(obj.id, obj.name, obj.latitude, obj.longitude, obj.country);
    }

    throw new Error('unable to deserialize LocationDto');
  }
}
