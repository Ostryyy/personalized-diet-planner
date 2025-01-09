import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeeklyMealPlan } from '../models/meal.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MealPlanService {
  private apiUrl = `${environment.apiUrl}/meal-plans`;

  constructor(private http: HttpClient) {}

  getWeeklyMealPlan(): Observable<{mealPlan: WeeklyMealPlan, message: string}> {
    return this.http.get<{mealPlan: WeeklyMealPlan, message: string}>(`${this.apiUrl}`);
  }

  generateMealPlan(): Observable<{mealPlan: WeeklyMealPlan, message: string}> {
    return this.http.post<{mealPlan: WeeklyMealPlan, message: string}>(`${this.apiUrl}/generate`, {});
  }
}
