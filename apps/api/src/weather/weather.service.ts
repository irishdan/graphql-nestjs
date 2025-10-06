import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';

type WeatherResult = {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    windspeed_10m_max: number[];
    cloudcover_mean: number[];
    snowfall_sum: number[];
  };
};

type MarineResult = {
  daily: {
    time: string[];
    wave_height_max: number[];
    wave_period_max: number[];
  };
};

@Injectable()
export class WeatherService {
  static readonly WEATHER_FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
  static readonly MARINE_FORECAST_API_URL = 'https://marine-api.open-meteo.com/v1/marine';

  constructor(private http: HttpService) {}

  async getWeatherForecastByLatLong(days: number, latitude: number, longitude: number): Promise<WeatherResult> {
    const { data } = await firstValueFrom<AxiosResponse<WeatherResult>>(
      this.http
        .get(
          `${WeatherService.WEATHER_FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum,windspeed_10m_max,cloudcover_mean&forecast_days=${days}&timezone=auto`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw Error(error.message);
          }),
        ),
    );

    if (!data) {
      throw new Error(`Could not find weather for co-ordinates '${latitude} ${longitude}'`);
    }

    return data;
  }

  async getMarineForecastByLatLong(days: number, latitude: number, longitude: number): Promise<MarineResult> {
    const { data } = await firstValueFrom<AxiosResponse<MarineResult>>(
      this.http
        .get(
          `${WeatherService.MARINE_FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_period_max&forecast_days=${days}&timezone=auto`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw Error(error.message);
          }),
        ),
    );

    if (!data) {
      throw new Error(`Could not find marin data for co-ordinates '${latitude} ${longitude}'`);
    }

    return data;
  }
}
