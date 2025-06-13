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
      },
      { 
        label: 'Transaction', 
        icon: 'pi pi-wallet', 
        routerLink: ['/transaction'],
      },
      { 
        label: 'Budget', 
        icon: 'pi pi-dollar', 
        routerLink: ['/budget'],
      },
      { 
        label: 'Category', 
        icon: 'pi pi-list', 
        routerLink: ['/category'],
      },
      { 
        label: 'Report', 
        icon: 'pi pi-chart-bar', 
        routerLink: ['/report'],
      },
      { 
        label: 'Account', 
        icon: 'pi pi-credit-card', 
        routerLink: ['/account'],
      },
      { 
        label: 'Profile', 
        icon: 'pi pi-user', 
        routerLink: ['/profile'],
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

  logout() {
    localStorage.removeItem('accessToken');
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  
  showImageModal: boolean = false;

  openImageModal() {
    this.showImageModal = true;
  }
}