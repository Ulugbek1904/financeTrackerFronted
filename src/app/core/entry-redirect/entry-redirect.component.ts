import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-redirect',
  imports: [],
  templateUrl: './entry-redirect.component.html',
})
export class EntryRedirectComponent implements OnInit {
  
  router = inject(Router);

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    const expiry = localStorage.getItem('expiryDate');
    const isExpired = new Date() > new Date(expiry || '');

    if (token && !isExpired) {
      this.router.navigateByUrl('/dashboard'); 
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}