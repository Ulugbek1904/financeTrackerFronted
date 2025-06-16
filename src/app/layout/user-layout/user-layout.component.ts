import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { TransactionFormComponent } from '../../features/transactions/components/transaction-form/transaction-form.component';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-layout',
  imports: [
    SidebarComponent,
    HeaderComponent,
    RouterOutlet,
    DialogModule,
    TransactionFormComponent,
    ToastModule,
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent {
  showTransactionModal = false;
  transactionType: 'income' | 'expense' = 'income';

  handleTransactionType(type: 'income' | 'expense') {
    this.transactionType = type;
    this.showTransactionModal = true;
  }

  onModalClose() {
    this.showTransactionModal = false;
  }
}
