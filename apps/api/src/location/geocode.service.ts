import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

type GeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
};

@Injectable()
export class GeocodeService {
  static readonly GEOCODE_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private http: HttpService) {}

  async findLocationByNameSearch(q: string): Promise<GeocodeResult> {
    const { data } = await firstValueFrom(
      this.http.get(`${GeocodeService.GEOCODE_API_URL}?name=${q}&count=1`).pipe(
        catchError((error: AxiosError) => {
          throw Error(error.message);
        }),
      ),
    );

    if (!data || !data.results || data.results.length === 0) {
      throw new Error(`Could not find location matching '${q}'`);
    }

    return {
      id: data.results[0].id,
      name: data.results[0].name,
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      country: data.results[0].country,
    };
  }
}
