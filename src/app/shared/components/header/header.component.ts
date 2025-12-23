import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service'; // Asegúrate de la ruta correcta
import { CartState } from 'src/app/state/cart.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Si usas scss
})
export class HeaderComponent {
  
  cart$: Observable<CartState>;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    this.cart$ = this.cartService.getCartState();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
  
  goToHome() {
    this.router.navigate(['/products']);
  }
}