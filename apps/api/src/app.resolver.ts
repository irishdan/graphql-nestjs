import { Args, Query, Resolver } from '@nestjs/graphql';
import { LocationDtoProvider } from '~/location/location.dto-provider';
import { WeatherDtoProvider } from '~/weather/weather.dto-provider';
import { ActivitiesResponseDto } from '~/activities/activity.response-dto';
import { ActivitiesResponseBuilder } from '~/activities/activities.response-builder';

@Resolver()
export class AppResolver {
  constructor(
    private readonly locationProvider: LocationDtoProvider,
    private readonly weatherService: WeatherDtoProvider,
    private readonly responseBuilder: ActivitiesResponseBuilder,
  ) {}

  @Query(() => ActivitiesResponseDto)
  async activities(@Args('city') location: string): Promise<ActivitiesResponseDto> {
    const place = await this.locationProvider.findByNameSearch(location);
    const sevenDayForecast = await this.weatherService.getForecastForLocation(7, place.latitude, place.longitude);

    return this.responseBuilder.build(place, sevenDayForecast);
  }
}
