import { Injectable } from '@nestjs/common';
import { LocationDto } from '~/location/location.dto';
import { ActivitiesResponseDto } from '~/activities/activity.response-dto';
import { ForecastDto } from '~/weather/forecast.dto';
import ForecastToActivityScore from '~/activities/score/forecast-to-activity-score';

@Injectable()
export class ActivitiesResponseBuilder {
  build(location: LocationDto, forecast: ForecastDto): ActivitiesResponseDto {
    const scores = {
      skiing: [] as { date: string; score: number }[],
      surfing: [] as { date: string; score: number }[],
      indoor_sightseeing: [] as { date: string; score: number }[],
      outdoor_sightseeing: [] as { date: string; score: number }[],
    };

    forecast.weather.forEach((weather, index) => {
      const marine = forecast.marine[index];

      scores.skiing.push(ForecastToActivityScore.calculate('skiing', weather, marine));
      scores.surfing.push(ForecastToActivityScore.calculate('surfing', weather, marine));
      scores.indoor_sightseeing.push(ForecastToActivityScore.calculate('indoor_sightseeing', weather, marine));
      scores.outdoor_sightseeing.push(ForecastToActivityScore.calculate('outdoor_sightseeing', weather, marine));
    });

    return new ActivitiesResponseDto(
      location.country,
      location.name,
      scores.skiing,
      scores.surfing,
      scores.indoor_sightseeing,
      scores.outdoor_sightseeing,
    );
  }
}
