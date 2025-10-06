import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { config } from '@/lib/config.ts';

const httpLink = new HttpLink({
  uri: config.api.baseUrl + '/graphql',
  fetchOptions: { cache: 'no-store' },
});

export const apollo = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {},
    },
  }),
});
