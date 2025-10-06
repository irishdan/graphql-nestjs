import { Toaster } from 'sonner';
import { ApolloProvider } from '@apollo/client/react';
import AppContainer from './components/layout/app-container.tsx';
import AppProvider from './lib/context/AppContext.tsx';
import { apollo } from './lib/api/appollo.ts';

function App() {
  return (
    <ApolloProvider client={apollo}>
      <AppProvider>
        <AppContainer />
        <Toaster />
      </AppProvider>
    </ApolloProvider>
  );
}

export default App;
