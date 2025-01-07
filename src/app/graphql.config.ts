import { APOLLO_OPTIONS, ApolloModule } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from "@angular/core";
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { environment } from "../environments/environment";

const uri = environment.apiUrl; // GraphQL server URL

const authContext = (auth: AngularFireAuth) =>
  setContext(async () => {
    // let localToken = localStorage.getItem('accessToken') ?? '';
    let token = ""; //await firstValueFrom(auth.idToken.pipe(take(1)));

    // if (token !== localToken) {
    //   localStorage.setItem('accessToken', token);
    // }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-hasura-admin-secret":
          "G01GPIQk4MQgBexSdadavbj0nXhiAt74XBnN6AwT3GK0dAvGcpO36irz5yY0Bivt",
        "X-Hasura-Role": "admin",
        "X-Hasura-Allowed-Roles": ["admin"],
      },
    };
  });

export function createApollo(
  httpLink: HttpLink,
  auth: AngularFireAuth
): ApolloClientOptions<any> {
  return {
    link: ApolloLink.from([
      authContext(auth),
      httpLink.create({ uri, withCredentials: true }),
    ]),
    cache: new InMemoryCache(),
  };
}

export const provideGraphql = (): Array<Provider | EnvironmentProviders> => {
  return [
    importProvidersFrom(ApolloModule),
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ];
};
