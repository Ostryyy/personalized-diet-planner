/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/core/services/auth.service';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    const authService = appRef.injector.get(AuthService);
    authService.initUserProfile();
  })
  .catch((err) => console.error(err));
