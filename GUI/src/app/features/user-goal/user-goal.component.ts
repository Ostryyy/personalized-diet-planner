import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-goal',
  standalone: true,
  templateUrl: './user-goal.component.html',
  styleUrls: ['./user-goal.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class UserGoalComponent {
  goalForm: FormGroup;
  destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,private router: Router,
  ) {
    this.goalForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(30)]],
      height: ['', [Validators.required, Validators.min(100)]],
      goal: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.authService
        .updateUserGoal(this.goalForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastr.success('Goal updated successfully!');
            this.router.navigate(['/']);
          },
          error: () =>
            this.toastr.error('Failed to update goal. Please try again.'),
        });
    }
  }
}
