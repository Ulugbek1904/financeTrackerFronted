import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialReport, ReportFilterDto, ReportResultDto } from '../../features/report/models';
import { ApiUrls } from '../../shared/apiUrl';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl: string;
    constructor(api: ApiUrls, private http: HttpClient) {
      this.apiUrl = api.reportUrl;
    }

  getReportMonthly(year: number, month: number): Observable<FinancialReport> {
    return this.http.get<FinancialReport>(`${this.apiUrl}/monthly/${year}/${month}`);
  }

  getReport(filter: ReportFilterDto): Observable<ReportResultDto> {
    return this.http.post<ReportResultDto>(`${this.apiUrl}/report`, filter);
  }
}