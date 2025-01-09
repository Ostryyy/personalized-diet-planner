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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
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
  }

  updateUserInformations(): void {
    if (this.userInfoForm.valid) {
      this.authService
        .updateUserInformations(this.userInfoForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastr.success('User information updated successfully!');
            this.router.navigate(['/']);
          },
          error: () =>
            this.toastr.error(
              'Failed to update user information. Please try again.'
            ),
        });
    }
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
