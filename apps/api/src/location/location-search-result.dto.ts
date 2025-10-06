import { DtoInterface } from '~/common/dto/dto.interface';

export class LocationSearchResultDto implements DtoInterface {
  static version = 1;

  public id: string;

  constructor(
    id: string,
    public locationId?: number,
  ) {
    this.id = id.toLowerCase();
  }

  getKey() {
    return `LocationSearchResultDto:${LocationSearchResultDto.version}:${this.id}`;
  }

  static keyFromValue(q: string) {
    return `LocationSearchResultDto:${LocationSearchResultDto.version}:${q.toLowerCase()}`;
  }

  static fromObject(obj: object): LocationSearchResultDto {
    if (
      'id' in obj &&
      typeof obj.id === 'string' &&
      (!('locationId' in obj) || typeof obj.locationId === 'number' || obj.locationId === undefined)
    ) {
      return new LocationSearchResultDto(obj.id, 'locationId' in obj ? (obj.locationId as number) : undefined);
    }

    throw new Error('unable to deserialize LocationSearchResultDto');
  }
}
