import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, finalize, map, Observable, of } from 'rxjs';
import { CheckoutService, ShippingRate } from 'src/app/services/checkout.service';
import { loadCartState } from 'src/app/state/cart.actions';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent {
  cartItems$ = this.store.select(selectCartItems);
  productTotal$ = this.store.select(selectTotalPrice);
  
  shippingRate: ShippingRate | null = null;
  address: any = null;
  isProcessing: boolean = false;

  constructor(
    private checkoutService: CheckoutService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shippingRate = this.checkoutService.getSelectedRate();
    this.address = this.checkoutService.getShippingAddress();

    if (!this.shippingRate || !this.address) {
      this.router.navigate(['/checkout/shipping']);
    }
  }

  get grandTotal$(): Observable<number> {
    return this.productTotal$.pipe(
      map(total => total + (this.shippingRate?.price || 0))
    );
  }

  onPay() {
    this.isProcessing = true;
    of(true).pipe(
      delay(2000),
      finalize(() => this.isProcessing = false)
    ).subscribe(() => {
      this.store.dispatch(loadCartState({ items: [] }));
      localStorage.removeItem('cart-state');
      this.router.navigate(['/checkout/success']);
    });
  }

}
