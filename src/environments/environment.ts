import { LogLevel } from 'app/shared/logs/log.model';

export const environment = {
    applicationName: 'TDS',
    appVersion: '0.0.1',
    production: false,
    debugger: true,
    apiUrl: 'https://tds-247365.hasura.app/v1/graphql',
    siteUrl: 'https://app.tds.com',
    siteResetUrl: 'https://app.tds.com/reset-password',
    wsUrl: 'wss://tds-247365.hasura.app/v1/graphql',
    defaultRole: 'admin',
    sessionKey: 's_326gn4zj21731406120274',
    encryptSecretKey: 'e2esp-actify',
    logName: 'tds-dev-web',
    apiLog: false,
    minutes: 60,
    logLevel: LogLevel.All,
    firebaseConfig: {
        apiKey: 'AIzaSyDwkyuKzSCkFDTt3OU2GfEMW8QhxesdVK4',
        authDomain: 'tds-dev-41f66.firebaseapp.com',
        projectId: 'tds-dev-41f66',
        storageBucket: 'tds-dev-41f66.firebasestorage.app',
        messagingSenderId: '203368249623',
        appId: '1:203368249623:web:d7a41f074f477f6c565f52',
    },
};
