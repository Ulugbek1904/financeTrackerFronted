import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-un-authorized',
  imports: [],
  template: `
    <div class="unauthorized-container">
      <h1>🚫 Ruxsat yo'q</h1>
      <p>Sizda ushbu sahifaga kirish uchun ruxsat mavjud emas.</p>
      <button (click)="goHome()">Bosh sahifaga qaytish</button>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70vh;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #c53030; /* qizil rang */
      background-color: #fff5f5; /* juda och qizil fon */
      border: 1px solid #f56565;
      border-radius: 8px;
      margin: 40px auto;
      padding: 40px;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(197, 48, 48, 0.3);
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 30px;
    }
    button {
      background-color: #c53030;
      color: white;
      border: none;
      padding: 12px 25px;
      font-size: 1rem;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #9b2c2c;
    }
  `] 
})
export class UnAuthorizedComponent {

  router = inject(Router);

  goHome() {
    this.router.navigate(['/home']);
  }
}
