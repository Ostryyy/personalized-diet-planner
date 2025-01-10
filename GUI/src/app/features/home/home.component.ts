import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WeightEntry } from '../../core/models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  weightChart: Chart | null = null;

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user?.weightHistory) {
          this.createWeightChart(user.weightHistory);
        }
      });
  }

  createWeightChart(weightHistory: WeightEntry[]): void {
    const dates = weightHistory.map((entry) =>
      new Date(entry.date).toLocaleDateString()
    );
    const weights = weightHistory.map((entry) => entry.weight);

    this.weightChart = new Chart('weightChart', {
      type: 'line' as ChartType,
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Weight History',
            data: weights,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Weight (kg)',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}
