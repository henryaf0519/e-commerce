import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartState } from 'src/app/state/cart.reducer';
import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cart$: Observable<CartState>;
  cartItems: CartItem[] = [];
  
  constructor(
      private router: Router,
     private cartService: CartService,
  ) {
    this.cart$ = this.cartService.getCartState();
  }

  ngOnInit(): void {
    this.cart$.subscribe(cart => {
      this.cartItems = cart.items;
    });
  }
  isUserMenuOpen = false;

  // Método para alternar la visibilidad del menú
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  goToHome(){
    this.router.navigate(['/products']);
  }
  goToCart(){
    this.router.navigate(['/cart']);
  }
}
