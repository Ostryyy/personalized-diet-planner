import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { WeeklyMealPlan } from '../../core/models/meal.model';
import { MealPlanService } from '../../core/services/meal.service';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meal-plan',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe, MatCardModule, MatButtonModule],
  templateUrl: './meal-plan.component.html',
  styleUrl: './meal-plan.component.scss',
})
export class MealPlanComponent {
  mealPlan: WeeklyMealPlan | null = null;
  destroyRef = inject(DestroyRef);
  private router = inject(Router);

  constructor(
    private mealPlanService: MealPlanService,
    private toastr: ToastrService
  ) {
    this.loadMealPlan();
  }

  loadMealPlan(): void {
    this.mealPlanService
      .getWeeklyMealPlan()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (plan) => {
          if (plan && Object.keys(plan.mealPlan).length > 0) {
            this.mealPlan = plan.mealPlan;
            console.log(this.mealPlan);
          } else {
            this.mealPlan = null;
            this.toastr.info('No meal plan found. Please generate a new one.');
          }
        },
        error: () => {
          this.toastr.error('Failed to load meal plan.');
        },
      });
  }

  generateMealPlan(): void {
    this.mealPlanService
      .generateMealPlan()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (plan) => {
          this.mealPlan = plan.mealPlan;
          this.toastr.success('Meal plan generated successfully!');
        },
        error: () => {
          this.toastr.error('Failed to generate meal plan.');
        },
      });
  }

  getWeekDays(): string[] {
    return this.mealPlan ? Object.keys(this.mealPlan) : [];
  }

  viewRecipe(recipeId: number): void {
    this.router.navigate(['/recipe', recipeId]);
  }
}
