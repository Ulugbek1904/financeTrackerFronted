import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TransactionService } from '../../../core/services/transaction.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from "../components/transaction-list/transaction-list.component";

@Component({
  selector: 'app-transaction-page',
  imports: [ButtonModule, SelectModule, FormsModule, CommonModule, TransactionListComponent],
  templateUrl: './transaction-page.component.html',
  styleUrl: './transaction-page.component.css'
})
export class TransactionPageComponent {

  transactionService = inject(TransactionService);
  exportTransactions() {
    this.transactionService.exportTransactions().subscribe({
    next: (blob: Blob) => {
      const fileName = `Mening-Tranzaktsiyalarim-${new Date().toISOString().slice(0,10)}.csv`;
      
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Export xatolik:', error);
    }
  });
  }


  showDropdown: boolean = false;
  selectedItem: string ='';
  dropdownItems = [
    { label: 'All time', value: 'all_time' },
    { label: 'This month', value: 'this_month' },
    { label: 'Last month', value: 'last_month' },
    { label: 'This year', value: 'this_year' },
    { label: 'Last year', value: 'last_year' }
  ];

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
