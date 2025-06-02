import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService, DashboardSummary } from '../../../core/services/dashboard.service';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-dashboard',
  imports: [PanelModule, CardModule, ChartModule, TableModule, CurrencyPipe, DatePipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  summary: DashboardSummary | null = null;
  loading = false;
  chartData: any;
  chartOptions: any;
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private dataService: DataService) {
  }

  ngOnInit(): void {
    this.loadSummary();

    this.dataService.transactionAdded$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.loadSummary();
    })
  }

  loadSummary() {
    this.loading = true;
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.summary = res;
        this.setUpChart();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading summary:', err);
        this.loading = false;
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setUpChart() {
    if (!this.summary) return;

    this.chartData = {
      labels: this.summary.monthlySummary.map(x => x.month),
      datasets: [
        {
          label: 'Income',
          data: this.summary.monthlySummary.map(x => x.totalIncome),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
        },
        {
          label: 'Expenses',
          data: this.summary.monthlySummary.map(x => x.totalExpense),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
        }
      ]
    };

    this.chartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '333',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Oylik Kirim va Chiqim',
          color: '#111',
          font: {
            size: 24
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.dataset.label}: ${ctx.formattedValue} so'm`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#444'
          },
          grid: {
            color: 'red'
          }
        },
        y: {
          ticks: {
            color: '#444',
            callback: (value: number) => `${value} so'm`
          },
          grid: {
            color: '#eee'
          }
        }
      }
    };

  }
}
