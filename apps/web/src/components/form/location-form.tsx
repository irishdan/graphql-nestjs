import * as yup from 'yup';
import { toast } from 'sonner';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { ActivitiesResponseDto } from '@repo/graphql';

import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';

import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormError } from '@/components/form/form-error.tsx';

const schema = yup
  .object({
    location: yup.string().required('Enter a town or city'),
  })
  .required();

type Inputs = yup.InferType<typeof schema>;

// Define activity types
export type ActivityType = 'SKIING' | 'SURFING' | 'INDOOR_SIGHTSEEING' | 'OUTDOOR_SIGHTSEEING';

// Function to generate activity fragment
const generateActivityFragment = (activity: string) => `
  ${activity.toLowerCase()} {
    days {
      date
      score
    }
  }
`;

// Create dynamic query based on selected activities
const createActivitiesQuery = (activities: ActivityType[]) => {
  const activityFragments = activities.map((activity) => generateActivityFragment(activity)).join('\n');

  return gql`
    query Activities($city: String!) {
      activities(city: $city) {
        placeName
        country
        ${activityFragments}
      }
    }
  `;
};

export function LocationForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [city, setCity] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<ActivityType[]>([
    'SKIING',
    'SURFING',
    'INDOOR_SIGHTSEEING',
    'OUTDOOR_SIGHTSEEING',
  ]);

  // Create the dynamic query based on selected activities
  const ACTIVITIES_QUERY = useMemo(() => createActivitiesQuery(selectedActivities), [selectedActivities]);

  // const { data, loading } = useActivitiesQuery({
  const { data, loading } = useQuery<{ activities: ActivitiesResponseDto }>(ACTIVITIES_QUERY, {
    variables: { city },
    skip: !city,
    fetchPolicy: 'no-cache', // @todo: for dev purposes
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setCity(data.location);
    } catch (error: unknown) {
      toast.error('Something went wrong!');
      console.error(error);
    }
  };

  const isActivitySelected = (activity: ActivityType) => selectedActivities.includes(activity);
  const buttonVariant = (activity: ActivityType) => {
    return isActivitySelected(activity) ? 'secondary' : 'outline';
  };

  const toggleActivity = (activity: ActivityType) => {
    if (isActivitySelected(activity)) {
      if (selectedActivities.length === 1) {
        // Prevent deselecting the last activity
        return;
      }
      setSelectedActivities(selectedActivities.filter((a) => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className={''}>
            <div className="grid gap-2">
              <Input {...register('location')} id="location" placeholder="Enter a town or city" />
              {errors.location && <FormError message={errors.location.message} />}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant={buttonVariant('SKIING')} onClick={() => toggleActivity('SKIING')}>
              Skiing
            </Button>
            <Button size="sm" variant={buttonVariant('SURFING')} onClick={() => toggleActivity('SURFING')}>
              Surfing
            </Button>
            <Button
              size="sm"
              variant={buttonVariant('INDOOR_SIGHTSEEING')}
              onClick={() => toggleActivity('INDOOR_SIGHTSEEING')}
            >
              Indoor Sightseeing
            </Button>
            <Button
              size="sm"
              variant={buttonVariant('OUTDOOR_SIGHTSEEING')}
              onClick={() => toggleActivity('OUTDOOR_SIGHTSEEING')}
            >
              Outdoor Sightseeing
            </Button>
          </div>
          <div className="grid gap-2 mt-2">
            <Button type="submit" disabled={!isValid || loading} className="w-full">
              Plan it
            </Button>
          </div>
        </div>
      </form>
      {data?.activities && (
        <div>
          <h2 className="text-xl">
            Activities in {data.activities.placeName}, {data.activities.country}, for the next week
          </h2>
          {data.activities.skiing && (
            <div className="pb-4">
              <h3 className="font-bold">Skiing</h3>
              {data.activities.skiing.days.map((day) => (
                <div key={day.date} className="pl-4">
                  {day.date}: {day.score}/100
                </div>
              ))}
            </div>
          )}
          {data.activities.surfing && (
            <div className="pb-4">
              <h3 className="font-bold">Surfing</h3>
              {data.activities.surfing.days.map((day) => (
                <div key={day.date} className="pl-4">
                  {day.date}: {day.score}/100
                </div>
              ))}
            </div>
          )}
          {data.activities.indoor_sightseeing && (
            <div className="pb-4">
              <h3 className="font-bold">Indoor Sightseeing</h3>
              {data.activities.indoor_sightseeing.days.map((day) => (
                <div key={day.date} className="pl-4">
                  {day.date}: {day.score}/100
                </div>
              ))}
            </div>
          )}
          {data.activities.outdoor_sightseeing && (
            <div className="pb-4">
              <h3 className="font-bold">Outdoor Sightseeing</h3>
              {data.activities.outdoor_sightseeing.days.map((day) => (
                <div key={day.date} className="pl-4">
                  {day.date}: {day.score}/100
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
