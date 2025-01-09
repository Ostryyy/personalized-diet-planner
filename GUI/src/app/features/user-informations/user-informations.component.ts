import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MealPlanService } from '../../core/services/meal.service';

@Component({
  selector: 'app-user-informations',
  standalone: true,
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class UserInformationsComponent {
  userInfoForm: FormGroup;
  destroyRef = inject(DestroyRef);
  isFormPreFilled = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private mealPlanService: MealPlanService
  ) {
    this.userInfoForm = this.fb.group({
      weight: [null, [Validators.required, Validators.min(30)]],
      height: [null, [Validators.required, Validators.min(100)]],
      age: [null, [Validators.required, Validators.min(10)]],
      gender: [null, Validators.required],
      activityLevel: [null, Validators.required],
      excludes: ['', [this.excludeValidator]],
      dietType: ['', Validators.required],
      goal: [null, Validators.required],
    });

    this.loadUserInformations();
  }

  loadUserInformations(): void {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.isFormPreFilled = true;
          this.userInfoForm.patchValue({
            weight: user.weight || null,
            height: user.height || null,
            age: user.age || null,
            gender: user.gender || null,
            activityLevel: user.activityLevel || null,
            excludes: user.excludes ? user.excludes.join(', ') : '',
            dietType: user.dietType || '',
            goal: user.goal || null,
          });
        }
      });
  }

  updateUserInformations(): void {
    if (this.userInfoForm.valid) {
      this.authService
        .updateUserInformations(this.userInfoForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastr.success('User information updated successfully!');
            if (this.isFormPreFilled) {
              this.showConfirmationDialog();
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () =>
            this.toastr.error(
              'Failed to update user information. Please try again.'
            ),
        });
    }
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
          this.generateMealPlanAndRedirect();
        }
      });
  }

  private generateMealPlanAndRedirect(): void {
    this.mealPlanService
      .generateMealPlan()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastr.success('Meal plan generated successfully!');
          this.router.navigate(['/meal-plan']);
        },
        error: () => {
          this.toastr.error('Failed to generate meal plan. Please try again.');
        },
      });
  }

  excludeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const valid = /^[a-zA-Z\s,]*$/.test(value);
    return valid ? null : { invalidExcludes: true };
  }
}
