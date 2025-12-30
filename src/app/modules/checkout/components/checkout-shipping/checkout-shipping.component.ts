import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, map, Observable, of } from 'rxjs';
import { CheckoutService, ShippingAddress } from 'src/app/services/checkout.service';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';


interface ShippingRate {
  id: string;
  provider: string;
  serviceName: string;
  days: string;
  price: number;
  image: string;
}

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
    this.loadMockRates();
  }

  loadMockRates() {
    this.loading = true;
    of([
      {
        id: 'rate_1',
        provider: 'FedEx',
        serviceName: 'Standard Ground',
        days: '3-5 días hábiles',
        price: 15000,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/1200px-FedEx_Express.svg.png'
      },
      {
        id: 'rate_2',
        provider: 'Servientrega',
        serviceName: 'Entrega Rápida',
        days: '1-2 días hábiles',
        price: 22500,
        image: 'https://seeklogo.com/images/S/servientrega-logo-C1494F3C64-seeklogo.com.png'
      },
      {
        id: 'rate_3',
        provider: 'Inter Rapidísimo',
        serviceName: 'Económico',
        days: '5-7 días hábiles',
        price: 9000,
        image: 'https://www.interrapidisimo.com/wp-content/uploads/2018/06/Logo-Inter.png'
      }
    ]).pipe(delay(2000)).subscribe(data => {
      this.rates = data;
      this.loading = false;
      this.selectedRate = data[0];
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
