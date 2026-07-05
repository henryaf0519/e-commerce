import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, take } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartState } from 'src/app/state/cart.reducer';
import { CartItem } from 'src/app/models/cart-item.model';
import { PromotionService } from 'src/app/services/promotion.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { selectDiscountAmount, selectDiscountPercentage, selectSubtotal, selectTotalPrice } from 'src/app/state/cart.selector';
import { Store } from '@ngrx/store';
import { applyDiscount } from 'src/app/state/cart.actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cart$: Observable<CartState>;
  totalPrice$: Observable<number>;
  subtotal$: Observable<number>;
  discountAmount$: Observable<number>;
  discountPercentage$: Observable<number>;

  discountCode: string = '';
  isApplying: boolean = false;
  discountError: string | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private promotionService: PromotionService,
    private checkoutService: CheckoutService,
    private store: Store

  ) {
    this.cart$ = this.cartService.getCartState();
    this.totalPrice$ = this.store.select(selectTotalPrice);
    this.subtotal$ = this.store.select(selectSubtotal);
    this.discountAmount$ = this.store.select(selectDiscountAmount);
    this.discountPercentage$ = this.store.select(selectDiscountPercentage);

  }

  // Eliminamos ngOnInit y showCart:
  // 1. 'showCart' no se usaba en el HTML (usabas cart$ | async).
  // 2. La suscripción manual causaba un memory leak.

  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  getQuantityOptions(item: CartItem): number[] {
    const maxStock = item.stock || 0;
    return Array.from({ length: maxStock }, (_, index) => index + 1);
  }

  // --- SOLUCIÓN PUNTO D: Tipado Estricto ---
  // Cambiamos 'any' por 'number | string'. Aunque el select envía strings, 
  // permitimos number por si se bindea directamente.
  updateQuantity(item: CartItem, quantity: number | string): void {
    const newQuantity = Number(quantity); // Conversión explícita y segura

    // Validación adicional de seguridad
    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    }

    if (newQuantity > item.stock) {
      alert(`Lo sentimos, solo quedan ${item.stock} unidades disponibles.`);
      return;
    }

    this.cartService.updateQuantity(item.id, item.size || '', item.color || '', newQuantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  goToCart() {
    //this.closeCart(); // Cerramos el sidebar
    this.router.navigate(['/checkout/info']); // Navegamos al inicio del checkout
  }

  applyDiscount(): void {
    this.isApplying = true;
    this.discountError = null;

    this.promotionService.validatePromotionCode(this.discountCode).subscribe({
      next: (res) => {
        // 🟢 Solo despachamos la acción a NgRx. 
        // Automáticamente actualizará todos los cálculos en el carrito y en el checkout.
        this.store.dispatch(applyDiscount({
          code: this.discountCode,
          percentage: res.percentage
        }));

        this.isApplying = false;
      },
      error: (err) => {
        this.isApplying = false;
        this.discountError = 'Invalid code';
      }
    });
  }


}