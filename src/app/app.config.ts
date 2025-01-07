import { provideHttpClient } from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, inject } from "@angular/core";
import { LuxonDateAdapter } from "@angular/material-luxon-adapter";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
} from "@angular/router";
import { provideFuse } from "@fuse";
import { TranslocoService, provideTransloco } from "@ngneat/transloco";
import { appRoutes } from "app/app.routes";
import { provideAuths } from "app/core/auth/auth.provider";
import { provideIcons } from "app/core/icons/icons.provider";
import { mockApiServices } from "app/mock-api";
import { firstValueFrom } from "rxjs";
import { TranslocoHttpLoader } from "./core/transloco/transloco.http-loader";
import { provideGraphql } from "./graphql.config";
import { EventRepository } from "./shared/core/domain/repository/event.repository";
import { EventAPI } from "./shared/core/data/api/event/event.api";
import { TenantAPI } from "./shared/core/data/api/tenant/tenant.api";
import { TenantRepository } from "./shared/core/domain/repository/tenant.repository";
import { AccountRepository } from "./shared/core/domain/repository/account.repository";
import { AccountAPI } from "./shared/core/data/api/account/account.api";
import { SponsorRepository } from "./shared/core/domain/repository/sponsor.repository";
import { SponsorAPI } from "./shared/core/data/api/sponsor/sponsor.api";
import { BrandRepository } from "./shared/core/domain/repository/brand.repository";
import { BrandAPI } from "./shared/core/data/api/brand/brand.api";
import { ProductRepository } from "./shared/core/domain/repository/product.repository";
import { ProductAPI } from "./shared/core/data/api/product/product.api";
import { SessionRepository } from "./shared/core/domain/repository/session.repository";
import { SessionAPI } from "./shared/core/data/api/session/session.api";
import { CampaignRepository } from "./shared/core/domain/repository/campaign.repository";
import { CampaignAPI } from "./shared/core/data/api/campaign/campaign.api";
import { environment } from "environments/environment";
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth,provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getMessaging,provideMessaging } from '@angular/fire/messaging';


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: "enabled" })
    ),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()),
    // Material Date Adapter
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: "D",
        },
        display: {
          dateInput: "DDD",
          monthYearLabel: "LLL yyyy",
          dateA11yLabel: "DD",
          monthYearA11yLabel: "LLLL yyyy",
        },
      },
    },

    // Transloco Config
    provideTransloco({
      config: {
        availableLangs: [
          {
            id: "en",
            label: "English",
          },
          {
            id: "tr",
            label: "Turkish",
          },
        ],
        defaultLang: "en",
        fallbackLang: "en",
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoHttpLoader,
    }),
    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translocoService = inject(TranslocoService);
        const defaultLang = translocoService.getDefaultLang();
        translocoService.setActiveLang(defaultLang);

        return () => firstValueFrom(translocoService.load(defaultLang));
      },
      multi: true,
    },

    provideGraphql(),

    // Fuse
    provideAuths(),
    provideIcons(),
    provideFuse({
      mockApi: {
        delay: 0,
        services: mockApiServices,
      },
      fuse: {
        layout: "classy",
        scheme: "light",
        screens: {
          sm: "600px",
          md: "960px",
          lg: "1280px",
          xl: "1440px",
        },
        theme: "theme-default",
        themes: [
          {
            id: "theme-default",
            name: "Default",
          },
          {
            id: "theme-brand",
            name: "Brand",
          },
          {
            id: "theme-teal",
            name: "Teal",
          },
          {
            id: "theme-rose",
            name: "Rose",
          },
          {
            id: "theme-purple",
            name: "Purple",
          },
          {
            id: "theme-amber",
            name: "Amber",
          },
        ],
      },
    }),
    {
      provide: SessionRepository,
      useClass: SessionAPI,
    },
    {
      provide: EventRepository,
      useClass: EventAPI,
    },
    {
      provide: BrandRepository,
      useClass: BrandAPI,
    },
    {
      provide: ProductRepository,
      useClass: ProductAPI,
    },
    {
      provide: TenantRepository,
      useClass: TenantAPI,
    },
    {
      provide: SponsorRepository,
      useClass: SponsorAPI,
    },
    {
      provide: AccountRepository,
      useClass: AccountAPI,
    },
    {
      provide: CampaignRepository,
      useClass: CampaignAPI,
    },
  ],
};
