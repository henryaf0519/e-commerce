import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartState } from 'src/app/state/cart.reducer';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';
import { closeCartSidebar } from 'src/app/state/cart.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-cart',
  templateUrl: './side-cart.component.html',
  styleUrls: ['./side-cart.component.scss']
})
export class SideCartComponent {
  cartItems$: Observable<any[]>;
  totalPrice$: Observable<number>;
  showSidebar$: Observable<boolean>;

  constructor(
    private router: Router,
    private store: Store<{ cart: CartState }>) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.totalPrice$ = this.store.select(selectTotalPrice);
    this.showSidebar$ = this.store.select(state => state.cart.showSidebar);
  }

  closeCart() {
    this.store.dispatch(closeCartSidebar());
  }

  goToCart() {
    this.closeCart();
    this.router.navigate(['/cart']);
  }
}