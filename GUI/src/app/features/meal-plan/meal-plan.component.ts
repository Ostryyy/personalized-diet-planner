import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { WeeklyMealPlan } from '../../core/models/meal.model';
import { MealPlanService } from '../../core/services/meal.service';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  private dialog = inject(MatDialog);

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

  showConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Generate New Meal Plan?',
        message: 'Your previous plan will be lost. Do you want to continue?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.generateMealPlan();
        }
      });
  }

  getWeekDays(): string[] {
    return this.mealPlan ? Object.keys(this.mealPlan) : [];
  }

  viewRecipe(recipeId: number): void {
    this.router.navigate(['/recipe', recipeId]);
  }
}
