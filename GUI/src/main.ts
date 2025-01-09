/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/core/services/auth.service';
import { firstValueFrom } from 'rxjs';

bootstrapApplication(AppComponent, appConfig)
  .then(async (appRef) => {
    const authService = appRef.injector.get(AuthService);
    await firstValueFrom(authService.initUserProfile());
  })
  .then(() => {
    console.log('Application initialized');
  })
  .catch((err) => console.error(err));
