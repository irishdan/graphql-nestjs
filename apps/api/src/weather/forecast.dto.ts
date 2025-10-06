import { DtoInterface } from '~/common/dto/dto.interface';

export type DayWeatherForecast = {
  date: string; // ISO date string
  temperatureHigh: number;
  temperatureLow: number;
  precipitationChance: number; // percentage
  windSpeed: number; // in km/h
  cloudCover: number; // percentage
  snowfall: number; // in cm
};

export type DayMarineForecast = {
  date: string; // ISO date string
  waveHeightMax: number; // in meters
  wavePeriodMax: number; // in meters
};

export class ForecastDto implements DtoInterface {
  static version = 1;

  constructor(
    public latitude: number,
    public longitude: number,
    public marine: DayMarineForecast[],
    public weather: DayWeatherForecast[],
  ) {}

  getKey() {
    return `ForecastDto:${ForecastDto.version}:${this.latitude}_${this.longitude}`;
  }

  static keyFromLatLong(latitude: number, longitude: number) {
    return `ForecastDto:${ForecastDto.version}:${latitude}_${longitude}`;
  }
}
