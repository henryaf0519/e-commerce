import { Component,OnInit  } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCartState } from './state/cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    const savedCart = localStorage.getItem('cart-state');
   
    if (savedCart) {
      const cartState = JSON.parse(savedCart);
      this.store.dispatch(loadCartState({ items: cartState.items }));
    }
  }
}
