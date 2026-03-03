import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { loadCartState, openCartSidebar } from './state/cart.actions';
import { selectCartItems } from './state/cart.selector';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
declare let fbq: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCheckoutRoute = false;
  isAdminRoute = false;
  isHomePage = false;
  
  
  cartCount$: Observable<number>;

  constructor(
    private store: Store,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    
    this.cartCount$ = this.store.select(selectCartItems).pipe(
      map(items => items ? items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0)
    );

    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;

      this.isCheckoutRoute = currentUrl.includes('/checkout');
      this.isAdminRoute = currentUrl.includes('/admin');
      
      // Verificamos si es la página principal (ruta vacía o /home)
      this.isHomePage = currentUrl === '/' || currentUrl === '/products';
      if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
      }
    });
  }

  ngOnInit(): void {
    const savedCart = localStorage.getItem('cart-state');
    if (savedCart) {
      const cartState = JSON.parse(savedCart);
      this.store.dispatch(loadCartState({ items: cartState.items }));
    }
  }

  toggleCart() {
    this.store.dispatch(openCartSidebar());
  }
}