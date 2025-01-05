import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.loading$ | async" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}
