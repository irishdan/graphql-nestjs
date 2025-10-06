import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** activities */
export type ActivitiesResponseDto = {
  __typename?: 'ActivitiesResponseDto';
  country: Scalars['String']['output'];
  indoor_sightseeing: Maybe<ActivityBlock>;
  outdoor_sightseeing: Maybe<ActivityBlock>;
  placeName: Scalars['String']['output'];
  skiing: Maybe<ActivityBlock>;
  surfing: Maybe<ActivityBlock>;
};

export type ActivityBlock = {
  __typename?: 'ActivityBlock';
  days: Array<DayScore>;
};

export type DayScore = {
  __typename?: 'DayScore';
  date: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  activities: ActivitiesResponseDto;
};


export type QueryActivitiesArgs = {
  city: Scalars['String']['input'];
};

export type ActivitiesQueryVariables = Exact<{
  city: Scalars['String']['input'];
}>;


export type ActivitiesQuery = { __typename?: 'Query', activities: { __typename?: 'ActivitiesResponseDto', placeName: string, country: string } };


export const ActivitiesDocument = gql`
    query Activities($city: String!) {
  activities(city: $city) {
    placeName
    country
  }
}
    `;

/**
 * __useActivitiesQuery__
 *
 * To run a query within a React component, call `useActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivitiesQuery({
 *   variables: {
 *      city: // value for 'city'
 *   },
 * });
 */
export function useActivitiesQuery(baseOptions: Apollo.QueryHookOptions<ActivitiesQuery, ActivitiesQueryVariables> & ({ variables: ActivitiesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActivitiesQuery, ActivitiesQueryVariables>(ActivitiesDocument, options);
      }
export function useActivitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActivitiesQuery, ActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActivitiesQuery, ActivitiesQueryVariables>(ActivitiesDocument, options);
        }
export function useActivitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ActivitiesQuery, ActivitiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ActivitiesQuery, ActivitiesQueryVariables>(ActivitiesDocument, options);
        }
export type ActivitiesQueryHookResult = ReturnType<typeof useActivitiesQuery>;
export type ActivitiesLazyQueryHookResult = ReturnType<typeof useActivitiesLazyQuery>;
export type ActivitiesSuspenseQueryHookResult = ReturnType<typeof useActivitiesSuspenseQuery>;
export type ActivitiesQueryResult = Apollo.QueryResult<ActivitiesQuery, ActivitiesQueryVariables>;