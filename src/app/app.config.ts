import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    provideApollo((): ApolloClientOptions<any> => {
      const httpLink = inject(HttpLink);

      return {
        cache: new InMemoryCache(),
        link: httpLink.create({ uri: 'http://localhost:4000/graphql' }) // ✅ Correct config object
      };
    })
  ]
};
