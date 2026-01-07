import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, first, map, Observable } from 'rxjs';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { CheckoutService, ShippingRate } from 'src/app/services/checkout.service';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  // Selectores de NgRx
  cartItems$ = this.store.select(selectCartItems);
  productTotal$ = this.store.select(selectTotalPrice);

  // Estado del componente
  shippingRate: ShippingRate | null = null;
  address: any = null;
  
  // Variables de Stripe
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  clientSecret: string | null = null;

  // Control de UI
  isProcessing: boolean = false; // Bloquea botones
  isLoadingStripe: boolean = false; // Spinner sobre el formulario

  constructor(
    private checkoutService: CheckoutService,
    private store: Store,
    private router: Router
  ) {}

  async ngOnInit() {
    this.shippingRate = this.checkoutService.getSelectedRate();
    this.address = this.checkoutService.getShippingAddress();

    if (!this.shippingRate || !this.address) {
      this.router.navigate(['/checkout/shipping']);
      return;
    }

    this.stripe = await loadStripe(environment.strippeKey); 
  }

  get grandTotal$(): Observable<number> {
    return this.productTotal$.pipe(
      map(total => total + (this.shippingRate?.price || 0))
    );
  }


  initPaymentFlow() {
    this.isProcessing = true;
    this.grandTotal$.pipe(first()).subscribe({
      next: (total) => {
        this.checkoutService.createPaymentIntent(total, this.address?.email)
          .pipe(
            finalize(() => {
            })
          )
          .subscribe({
            next: (response) => {
              this.clientSecret = response.clientSecret;
              setTimeout(() => this.mountStripeElement(this.clientSecret!), 0);
            },
            error: (error) => {
              this.isProcessing = false;
              alert('Error al iniciar el pago. Intenta nuevamente.');
            }
          });
      }
    });
  }

  // --- Helper: Montar el formulario de Stripe ---
  mountStripeElement(secret: string) {
    if (!this.stripe) return;
    
    this.isLoadingStripe = true;

    this.elements = this.stripe.elements({ 
      clientSecret: secret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#d946ef',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
        }
      }
    });

    const paymentElement = this.elements.create('payment');
    paymentElement.mount('#payment-element');

    paymentElement.on('ready', () => {
      this.isLoadingStripe = false;
      this.isProcessing = false;
    });
  }

  async confirmPayment() {
    if (!this.stripe || !this.elements) return;

    this.isProcessing = true;

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: this.address.name,
            email: this.address.email,
            address: {
              line1: this.address.street1,
              city: this.address.city,
              state: this.address.state,
              postal_code: this.address.zip,
              country: this.address.country
            }
          }
        }
      },
    });
    if (error) {
      this.isProcessing = false;
      console.error(error.message);
      alert(error.message); 
    }
  }
}