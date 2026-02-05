import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, map, Observable, of, take } from 'rxjs';
import { CheckoutService, ShippingAddress, ShippingRate } from 'src/app/services/checkout.service';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';



@Component({
  selector: 'app-checkout-shipping',
  templateUrl: './checkout-shipping.component.html',
  styleUrls: ['./checkout-shipping.component.scss']
})
export class CheckoutShippingComponent {

  cartItems$ = this.store.select(selectCartItems);
  productTotal$ = this.store.select(selectTotalPrice);
  
  address: ShippingAddress | null = null;
  loading: boolean = true;
  rates: ShippingRate[] = [];
  selectedRate: ShippingRate | null = null;
  messageError: string | null = null;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.address = this.checkoutService.getShippingAddress();
    
    if (!this.address) {
      this.router.navigate(['/checkout/info']);
      return;
    }

    this.loadRates();
  }

  loadRates() {
    this.loading = true;
    this.cartItems$.pipe(take(1)).subscribe(items => {
      console.log('Items redux:', items);
      
      if (!this.address) return;

      this.checkoutService.getShippingRates(this.address, items).subscribe({
        next: (response) => {
          this.rates = response.rates;
          if (this.rates.length > 0) {
            this.selectedRate = this.rates[0];
          }
          console.log('Fetched rates', this.rates);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching rates', err);
          this.messageError = err.error?.message || 'Failed to fetch shipping rates.';
          this.loading = false;
        }
      });
    });
  }

  selectRate(rate: ShippingRate) {
    this.selectedRate = rate;
  }

  get totalWithShipping$(): Observable<number> {
    return this.productTotal$.pipe(
      map(total => total + (this.selectedRate?.price || 0))
    );
  }

  goToPayment() {
    if (this.selectedRate) {
      this.checkoutService.setSelectedRate(this.selectedRate);
      this.router.navigate(['/checkout/payment']);
    }
  }

}
