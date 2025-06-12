import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FinancialReport, ReportFilterDto, ReportResultDto } from '../models';
import { ReportService } from '../../../core/services/report.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CalendarModule, DropdownModule, FormsModule, CardModule],
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css'],
})
export class ReportPageComponent implements OnInit {
  monthlyReport: FinancialReport | null = null;
  customReport: ReportResultDto | null = null;
  filter: ReportFilterDto = {
    startDate: new Date(),
    endDate: new Date(),
    categoryIds: [],
    accountIds: [],
  };
  yearOptions: { label: string; value: number }[] = [];
  monthOptions: { label: string; value: number }[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  loading: boolean = false;

  constructor(private reportService: ReportService) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.yearOptions.push({ label: i.toString(), value: i });
    }
    for (let i = 1; i <= 12; i++) {
      this.monthOptions.push({ label: i.toString().padStart(2, '0'), value: i });
    }
  }

  ngOnInit() {
    this.loadMonthlyReport();
  }

  loadMonthlyReport() {
    this.loading = true;
    this.reportService.getReportMonthly(this.selectedYear, this.selectedMonth).subscribe({
      next: (data: FinancialReport) => {
        this.monthlyReport = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching monthly report:', error);
        this.loading = false;
      },
    });
  }

  onFilterSubmit() {
    this.loading = true;
    this.reportService.getReport(this.filter).subscribe({
      next: (data: ReportResultDto) => {
        this.customReport = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching custom report:', error);
        this.loading = false;
      },
    });
  }
}