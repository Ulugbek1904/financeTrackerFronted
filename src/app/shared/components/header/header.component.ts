import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  router = inject(Router);
  currentSection: string = '';
  @Output() transactionTypeSelected = new EventEmitter<'income' | 'expense'>();

  @HostListener('document:keydown.F1', ['$event'])
  onF1(event: KeyboardEvent) {
    event.preventDefault();
    this.addIncome();
  }

  @HostListener('document:keydown.F2', ['$event'])
  onF2(event: KeyboardEvent) {
    event.preventDefault();
    this.addExpense();
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const path = event.urlAfterRedirects.split('/')[1];
      
      switch(path) {
        case 'dashboard':
          this.currentSection = 'Dashboard';
          break;
        case 'transaction':
          this.currentSection = 'Tranzaksiyalar';
          break;
        case 'budget':
          this.currentSection = 'Budget';
          break;
        case 'category':
          this.currentSection = 'Category';
          break;
        case 'report':
          this.currentSection = 'Report';
          break;
        case 'account':
          this.currentSection = 'Account';
          break;
        case 'profile':
          this.currentSection = 'Profile';
          break;
        case 'settings':
          this.currentSection = 'Settings';
          break;
        default:
          this.currentSection = '';
      }
    });
  }


  addIncome() {
    this.transactionTypeSelected.emit('income');
  }

  addExpense() {
    this.transactionTypeSelected.emit('expense');
  }

}
