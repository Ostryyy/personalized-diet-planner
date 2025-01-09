import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { goalGuard } from './core/guards/goal.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard, goalGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'user-informations',
    loadComponent: () =>
      import('./features/user-informations/user-informations.component').then(
        (m) => m.UserInformationsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'meal-plan',
    loadComponent: () =>
      import('./features/meal-plan/meal-plan.component').then(
        (m) => m.MealPlanComponent
      ),
    canActivate: [authGuard, goalGuard],
  },
  {
    path: 'recipe/:id',
    loadComponent: () =>
      import('./features/recipe-details/recipe-details.component').then(
        (m) => m.RecipeDetailsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
