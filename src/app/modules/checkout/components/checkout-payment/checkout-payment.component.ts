import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, first, firstValueFrom, map, Observable } from 'rxjs';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import {
  CheckoutService,
  ShippingRate,
} from 'src/app/services/checkout.service';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';
import { environment } from 'src/environments/environment';
import { clearCart } from 'src/app/state/cart.actions';

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

    // 1. Confirmar pago con Stripe (Sin redirección automática)
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

    if (result.error) {
      // Caso Error de Stripe
      this.isProcessing = false;
      this.errorMessage = result.error.message || 'Error en el pago';
      this.showErrorModal = true;
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === 'succeeded'
    ) {
      console.log('Pago Stripe exitoso :', result);
      try {
        const cartItems = await firstValueFrom(this.cartItems$);

        const orderPayload = {
          businessId: environment.businessId,
          email: this.address.email,
          shippoRateId: this.shippingRate?.id,
          paymentIntentId: result.paymentIntent.id, 
          items: cartItems.map((item: any) => ({
            productId: item.id,
            title: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: this.address.name,
            street1: this.address.street1,
            city: this.address.city,
            state: this.address.state,
            zip: this.address.zip,
            country: this.address.country,
            phone: this.address.phone || '0000000000',
          },
        };

        console.log('Enviando orden al backend:', orderPayload);
        this.checkoutService.createOrder(orderPayload).subscribe({
          next: (response) => {
            console.log('Orden creada en Backend:', response);
            this.isProcessing = false; 
            this.store.dispatch(clearCart());        
            this.router.navigate(['/checkout/success'], {
              state: { orderResponse: response },
            });
          },
          error: (err) => {
            console.error('Error creando orden en backend:', err);
            this.isProcessing = false;
            this.errorMessage =
              'El pago fue exitoso, pero hubo un error registrando tu pedido. Por favor contáctanos.';
            this.showErrorModal = true;
          },
        });
      } catch (error) {
        console.error('Error procesando orden:', error);
        this.isProcessing = false;
        this.errorMessage = 'Error inesperado procesando el pedido.';
        this.showErrorModal = true;
      }
    }
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }
}
