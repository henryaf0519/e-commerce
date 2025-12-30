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

  constructor(
    private store: Store,
    private router: Router 
  ) {
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      this.isCheckoutRoute = event.urlAfterRedirects.includes('/checkout');
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