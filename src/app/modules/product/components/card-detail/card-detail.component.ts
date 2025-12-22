import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CartService } from 'src/app/services/cart.service';
import { InventoryService } from 'src/app/services/inventory-service.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms 0s ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms 0s ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CardDetailComponent implements OnInit {
  showModal: boolean = false;
  message: string = '';
  productId: string | null = null;
  product: CartItem | null = null;
  loading: boolean = true;

  // Inicializamos con valores por defecto para evitar nulos
  selectedOptions: { size: string; color: string; quantity: number } = {
    size: '',
    color: '',
    quantity: 1, // Por defecto 1 para facilitar la compra rápida
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private cartService: CartService,
    private inventoryService: InventoryService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['productData']) {
      this.product = navigation.extras.state['productData'] as CartItem;
      this.productId = this.product.id;
      this.loading = false;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.productId = params['id'];
      }
      if (!this.product && this.productId) {
        this.loadProduct(this.productId);
      } else if (!this.product && !this.productId) {
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.inventoryService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando el producto:', err);
        this.loading = false;
      },
    });
  }

  // Actualizamos las opciones cuando el usuario interactúa con el componente hijo
  handleSelectionChange(selection: {
    size: string;
    color: string;
    quantity: number;
  }): void {
    this.selectedOptions = selection;
  }

  addToCart(): void {
    // CAMBIO PRINCIPAL: Solo validamos que exista el producto y la cantidad sea > 0
    // Ya NO validamos si size o color tienen valor.
    if (this.product && this.selectedOptions.quantity > 0) {
      const item: CartItem = {
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,

        // Usamos lo que venga. Si está vacío, se va vacío (perfecto para productos sin variantes)
        size: this.selectedOptions.size || '',
        color: this.selectedOptions.color || '',

        quantity: this.selectedOptions.quantity,

        stock: this.product.stock,
        price: this.product.price,
        images: this.product.images,
        show: this.product.show,
      };

      this.cartService.addToCart(item);
      this.showModal = true;
      this.message = 'Producto agregado al carrito!';
    } else {
      // Mensaje de error simplificado
      alert('Por favor selecciona una cantidad válida.');
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  getStockArray(): number[] {
    if (!this.product || this.product.stock <= 0) {
      return [];
    }
    // Crea un array de largo 'stock', llenándolo con el índice + 1
    return Array.from({ length: this.product.stock }, (_, i) => i + 1);
  }

  // Actualizamos el método para que sea más simple, ya que el select nos da valores seguros
  updateQuantitySelect(event: any): void {
    const val = parseInt(event.target.value, 10);
    this.selectedOptions.quantity = val;
  }
}
