import { PanelMenu } from 'primeng/panelmenu';
/* sidebar.component.ts */
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  imports: [PanelMenu, DialogModule],
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  profileImageUrl = '';
  items: MenuItem[] = [];
  
  authService = inject(AuthService);
  router = inject(Router);
  userService = inject(UserService);

  ngOnInit() {
    this.items = [
      { 
        label: 'Dashboard', 
        icon: 'pi pi-home', 
        routerLink: ['/dashboard'],
        command: () => this.handleMenuClick('Dashboard')
      },
      { 
        label: 'Transaction', 
        icon: 'pi pi-wallet', 
        routerLink: ['/transaction'],
        command: () => this.handleMenuClick('Tranzaksiyalar')
      },
      { 
        label: 'Budget', 
        icon: 'pi pi-dollar', 
        routerLink: ['/budget'],
        command: () => this.handleMenuClick('Budget')
      },
      { 
        label: 'Category', 
        icon: 'pi pi-list', 
        routerLink: ['/category'],
        command: () => this.handleMenuClick('Category')
      },
      { 
        label: 'Report', 
        icon: 'pi pi-chart-bar', 
        routerLink: ['/report'],
        command: () => this.handleMenuClick('Report')
      },
      { 
        label: 'Account', 
        icon: 'pi pi-credit-card', 
        routerLink: ['/account'],
        command: () => this.handleMenuClick('Account')
      },
      { 
        label: 'Profile', 
        icon: 'pi pi-user', 
        routerLink: ['/profile'],
        command: () => this.handleMenuClick('Profile')
      }
    ];
    
    this.userService.getMe().subscribe({
      next: user => {
        if (user.profilePictureUrl) {
          this.profileImageUrl = user.profilePictureUrl;
        }
      },
      error: err => {
        console.error('Foydalanuvchi ma\'lumotlarini olishda xatolik:', err);
      }
    });
  }

  handleMenuClick(sectionName: string) {
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  // profile picture
  showImageModal: boolean = false;

  openImageModal() {
    this.showImageModal = true;
  }
}