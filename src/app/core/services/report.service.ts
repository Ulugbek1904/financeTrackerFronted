import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialReport, ReportFilterDto, ReportResultDto } from '../../features/report/models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = 'http://localhost:5192/api/reports';

  constructor(private http: HttpClient) {}

  getReportMonthly(year: number, month: number): Observable<FinancialReport> {
    return this.http.get<FinancialReport>(`${this.apiUrl}/monthly/${year}/${month}`);
  }

  getReport(filter: ReportFilterDto): Observable<ReportResultDto> {
    return this.http.post<ReportResultDto>(`${this.apiUrl}/report`, filter);
  }
}