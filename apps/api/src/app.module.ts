import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from '~/app.resolver';
import { WeatherDtoProvider } from '~/weather/weather.dto-provider';
import { HttpModule } from '@nestjs/axios';
import { LocationDtoProvider } from '~/location/location.dto-provider';
import { ActivitiesResponseBuilder } from '~/activities/activities.response-builder';
import { CacheHandlerRedis } from '~/common/cache/redis/CacheHandlerRedis';
import { ApplicationExceptionFilter } from '~/common/exception/application-exception.filter';
import { GeocodeService } from '~/location/geocode.service';
import { WeatherService } from '~/weather/weather.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 1,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: '../../packages/schema/schema.graphql', // write inside the monorepo
      sortSchema: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [
    {
      provide: 'CacheHandlerInterface',
      useClass: CacheHandlerRedis,
    },
    GeocodeService,
    WeatherService,
    ApplicationExceptionFilter,
    LocationDtoProvider,
    WeatherDtoProvider,
    ActivitiesResponseBuilder,
    AppResolver,
  ],
})
export class AppModule {}
