import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor'; // Import the interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload', // 👈 KEY FIX
      }),
      withComponentInputBinding(),
    ),
    provideAnimationsAsync(),
    // Add the interceptor right here!
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
