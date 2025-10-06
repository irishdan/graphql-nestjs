import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CacheHandlerInterface } from '~/common/cache/cache-handler.interface';
import { ForecastDto } from '~/weather/forecast.dto';
import { WeatherService } from '~/weather/weather.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherDtoProvider {
  protected readonly cacheTtl: number;

  constructor(
    @Inject('CacheHandlerInterface') private cacheHandler: CacheHandlerInterface,
    private http: HttpService,
    private weatherService: WeatherService,
    private readonly config: ConfigService,
  ) {
    this.cacheTtl = this.config.get<number>('WEATHER_CACHE_TTL') ?? 1200;
  }

  async getForecastForLocation(days: number, latitude: number, longitude: number): Promise<ForecastDto> {
    const cached = await this.cacheHandler.get<ForecastDto>(ForecastDto.keyFromLatLong(latitude, longitude));

    if (cached) {
      return cached;
    }

    const [weather, marine] = await Promise.all([
      this.weatherService.getWeatherForecastByLatLong(days, latitude, longitude),
      this.weatherService.getMarineForecastByLatLong(days, latitude, longitude),
    ]);

    const dto = new ForecastDto(
      latitude,
      longitude,
      marine.daily.time.map((date: string, index: number) => {
        return {
          date: date,
          waveHeightMax: marine.daily.wave_height_max[index],
          wavePeriodMax: marine.daily.wave_period_max[index],
        };
      }),
      weather.daily.time.map((date: string, index: number) => {
        return {
          date: date,
          temperatureHigh: weather.daily.temperature_2m_max[index],
          temperatureLow: weather.daily.temperature_2m_min[index],
          precipitationChance: weather.daily.precipitation_probability_max[index],
          windSpeed: weather.daily.windspeed_10m_max[index],
          cloudCover: weather.daily.cloudcover_mean[index],
          snowfall: weather.daily.snowfall_sum[index],
        };
      }),
    );

    await this.cacheHandler.set(dto, this.cacheTtl);

    return dto;
  }
}
