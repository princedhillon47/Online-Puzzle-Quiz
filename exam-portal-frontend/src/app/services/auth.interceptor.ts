import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inject the PLATFORM_ID to check where this code is running
  const platformId = inject(PLATFORM_ID);
  let token = null;

  // 2. ONLY try to use localStorage if we are in the actual browser
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }

  // 3. If a token exists, clone the request and attach it
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  // 4. If no token (or if running on the server), just send it normally
  return next(req);
};
