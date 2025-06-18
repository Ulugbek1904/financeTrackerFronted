import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export  class ApiUrls {
    accountUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api/accounts';
    categoryUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api/category';
    transactionUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api/transaction';
    userUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api/home';
    authUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api';
    profileUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api/profile';
    budgetUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api/budget';
    reportUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api/reports';
    dashboardUrl: string = 'https://financetrackerbackend-1tp6.onrender.com/api';
}