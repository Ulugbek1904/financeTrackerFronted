import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ApiUrls {
    baseUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api';
    accountUrl: string = `${this.baseUrl}/accounts`;
    categoryUrl: string = `${this.baseUrl}/category`;
    transactionUrl: string = `${this.baseUrl}/transaction`;
    userUrl: string = `${this.baseUrl}`;
    authUrl: string = `${this.baseUrl}`;
    profileUrl: string = `${this.baseUrl}/profile`;
    budgetUrl: string = `${this.baseUrl}/budget`;
    reportUrl: string = `${this.baseUrl}/reports`;
    dashboardUrl: string = `${this.baseUrl}`;
}