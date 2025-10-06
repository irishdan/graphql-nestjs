import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DayScore {
  @Field() date!: string; // "2025-10-01"
  @Field(() => Int) score!: number; // 0..100
}

@ObjectType()
export class ActivityBlock {
  @Field(() => [DayScore]) days!: DayScore[];
}

@ObjectType({ description: 'activities' })
export class ActivitiesResponseDto {
  constructor(
    city: string,
    country: string,
    skiing: any,
    surfing: any,
    outdoor_sightseeing: any,
    indoor_sightseeing: any,
  ) {
    this.placeName = city;
    this.country = country;
    this.skiing = { days: skiing };
    this.surfing = { days: surfing };
    this.outdoor_sightseeing = { days: outdoor_sightseeing };
    this.indoor_sightseeing = { days: indoor_sightseeing };
  }

  @Field() placeName!: string;
  @Field() country!: string;

  @Field(() => ActivityBlock, { nullable: true }) skiing: ActivityBlock;
  @Field(() => ActivityBlock, { nullable: true }) surfing: ActivityBlock;
  @Field(() => ActivityBlock, { nullable: true }) outdoor_sightseeing: ActivityBlock;
  @Field(() => ActivityBlock, { nullable: true }) indoor_sightseeing: ActivityBlock;
}
