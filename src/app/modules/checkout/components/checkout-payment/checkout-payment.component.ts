import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, first, map, Observable } from 'rxjs';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import {
  CheckoutService,
  ShippingRate,
} from 'src/app/services/checkout.service';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  
  cartItems$ = this.store.select(selectCartItems);
  productTotal$ = this.store.select(selectTotalPrice);

  
  shippingRate: ShippingRate | null = null;
  address: any = null;


  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  clientSecret: string | null = null;

  isProcessing: boolean = false;
  isLoadingStripe: boolean = false;

  showErrorModal: boolean = false;
  errorMessage: string = '';

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
      map((total) => total + (this.shippingRate?.price || 0))
    );
  }

  initPaymentFlow() {
    this.isProcessing = true;
    this.grandTotal$.pipe(first()).subscribe({
      next: (total) => {
        this.checkoutService
          .createPaymentIntent(total, this.address?.email)
          .pipe(finalize(() => {}))
          .subscribe({
            next: (response) => {
              this.clientSecret = response.clientSecret;
              setTimeout(() => this.mountStripeElement(this.clientSecret!), 0);
            },
            error: (error) => {
              this.isProcessing = false;
              alert('Error al iniciar el pago. Intenta nuevamente.');
            },
          });
      },
    });
  }

  // --- Helper: Montar el formulario de Stripe ---
  mountStripeElement(secret: string) {
    if (!this.stripe) return;

    this.isLoadingStripe = true;

    this.elements = this.stripe.elements({
      clientSecret: secret,
      locale: 'en',
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#d946ef',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
        },
      },
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
    const result = await this.stripe.confirmPayment({
      elements: this.elements,
      redirect: 'if_required',
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
              country: this.address.country,
            },
          },
        },
      },
    });

    console.log('📦 Respuesta cruda de Stripe:', result);

    if (result.error) {
      this.isProcessing = false;
      console.error('Error:', result.error.message);
      this.errorMessage = result.error.message || 'Ocurrió un error desconocido';
      this.showErrorModal = true;
    } else if (result.paymentIntent) {
      // Caso: Éxito (El pago pasó correctamente sin redirección)
      console.log('Éxito! PaymentIntent:', result.paymentIntent);

      if (result.paymentIntent.status === 'succeeded') {
        this.router.navigate(['/checkout/success']);
      } else {
        console.log('⚠️ Estado del pago:', result.paymentIntent.status);
      }
    }
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }
}
