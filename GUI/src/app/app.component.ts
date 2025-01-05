import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'personalized-diet-planner';

  constructor(public authService: AuthService, private toastr: ToastrService) {}
}
