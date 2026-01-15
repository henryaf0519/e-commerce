import { Component, OnInit } from '@angular/core';
// Importamos Router y NavigationEnd para detectar la URL actual
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { loadCartState } from './state/cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Variable para controlar la visibilidad del layout
  isCheckoutRoute = false;
  isAdminRoute = false;

  constructor(
    private store: Store,
    private router: Router 
  ) {
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;

      this.isCheckoutRoute = event.urlAfterRedirects.includes('/checkout');
      this.isAdminRoute = currentUrl.includes('/admin');
    });
  }

  ngOnInit(): void {
    const savedCart = localStorage.getItem('cart-state');
   
    if (savedCart) {
      const cartState = JSON.parse(savedCart);
      this.store.dispatch(loadCartState({ items: cartState.items }));
    }
  }
}