import { PanelMenu } from 'primeng/panelmenu';
/* sidebar.component.ts */
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  imports: [PanelMenu, DialogModule, RouterLink],
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  profileImageUrl = '';
  items: MenuItem[] = [];

  private token: string | null = localStorage.getItem('accessToken');
  private payload = JSON.parse(atob(this.token?.split('.')[1] || ''));
  userRole: string = this.payload.role;
  
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

    if (this.userRole === 'Admin') {
      this.items.push({
        label: 'user Control',
        icon: 'pi pi-user-edit',
        routerLink: ['/admin']
      });
    }
    if(this.userRole === 'SuperAdmin') {
      this.items.push({
        label: 'Control Panel',
        icon: 'pi pi-cog',
        items: [
          { label: 'Users', icon: 'pi pi-users', routerLink: ['/users'] },
          { label: 'Roles', icon: 'pi pi-shield', routerLink: ['/roles'] }
        ]
      });
    }
    
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