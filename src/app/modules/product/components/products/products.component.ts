import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { InventoryService } from 'src/app/services/inventory-service.service'; // Importamos el servicio
import { CartState } from 'src/app/state/cart.reducer';
import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  cartItems: CartItem[] = [];
  cart$: Observable<CartState>;
  
  products: CartItem[] = []; 
  loading: boolean = true;

  constructor(
    private cartService: CartService,
    private inventoryService: InventoryService,
    private router: Router
  ) {
    this.cart$ = this.cartService.getCartState();
  }

  ngOnInit(): void {
    // 1. Mantener suscripción al estado del carrito
    this.cart$.subscribe(cart => {
      this.cartItems = cart.items;
    });

    // 2. Cargar productos desde la API
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    // Llamada al método que creamos para traer solo los visibles (show: true)
    this.inventoryService.getVisibleProducts().subscribe({
      next: (data) => {
        console.log('Productos cargados:', data);
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar catálogo:', err);
        this.loading = false;
      }
    });
  }

  totalCartPrice() {
    // Nota: Usamos 'quantity' (cantidad en carrito), no 'stock' (existencia en bodega)
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  onProductClicked(product: CartItem) {
    this.router.navigate(['products/detail'], { 
      queryParams: { id: product.id }, 
      state: { productData: product } 
    });
  }
}