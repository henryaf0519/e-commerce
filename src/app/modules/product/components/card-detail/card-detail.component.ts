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
  // --- TUS VARIABLES ORIGINALES (INTACTAS) ---
  showModal: boolean = false;
  message: string = '';
  productId: string | null = null;
  product: CartItem | null = null;
  loading: boolean = true;

  selectedOptions: { size: string; color: string; quantity: number } = {
    size: '',
    color: '',
    quantity: 1,
  };

  // --- NUEVAS VARIABLES (PARA EL ESTILO SHOPIFY) ---
  mainImage: string = ''; // Controla la foto grande de la galería
  
  // Control de los acordeones de información (Descripción abierta por defecto)
  accordions = {
    description: true,
    ingredients: false,
    shipping: false
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
      
      // SHOP_LOGIC: Inicializamos la imagen principal si viene por navegación
      if (this.product.images?.length) {
        this.mainImage = this.product.images[0];
      }
      
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
        
        // SHOP_LOGIC: Inicializamos la imagen principal al cargar de API
        if (this.product?.images?.length) {
          this.mainImage = this.product.images[0];
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando el producto:', err);
        this.loading = false;
      },
    });
  }

  // --- MÉTODOS VISUALES SHOPIFY (NUEVOS) ---

  // Cambiar la foto principal al hacer click en miniatura
  changeImage(img: string): void {
    this.mainImage = img;
  }

  // Abrir/Cerrar acordeones de información
  toggleAccordion(section: 'description' | 'ingredients' | 'shipping'): void {
    this.accordions[section] = !this.accordions[section];
  }

  // Aumentar cantidad (usando tus selectedOptions)
  increaseQuantity(): void {
    if (this.product && this.selectedOptions.quantity < this.product.stock) {
      this.selectedOptions.quantity++;
    }
  }

  // Disminuir cantidad
  decreaseQuantity(): void {
    if (this.selectedOptions.quantity > 1) {
      this.selectedOptions.quantity--;
    }
  }

  // --- TUS MÉTODOS ORIGINALES (MANTENIDOS) ---

  handleSelectionChange(selection: { size: string; color: string; quantity: number }): void {
    this.selectedOptions = selection;
  }

  addToCart(): void {
    if (this.product && this.selectedOptions.quantity > 0) {
      const item: CartItem = {
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        size: this.selectedOptions.size || '',
        color: this.selectedOptions.color || '',
        quantity: this.selectedOptions.quantity,
        stock: this.product.stock,
        price: this.product.price,
        images: this.product.images,
        show: this.product.show,
        isNew: this.product.isNew 
      };

      this.cartService.addToCart(item);
      this.showModal = true;
      this.message = 'Producto agregado al carrito!';
    } else {
      alert('Por favor selecciona una cantidad válida.');
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  // Helper para select (si decides mantener el select en lugar de los botones +/-)
  updateQuantitySelect(event: any): void {
    const val = parseInt(event.target.value, 10);
    this.selectedOptions.quantity = val;
  }
  
  getStockArray(): number[] {
    if (!this.product || this.product.stock <= 0) {
      return [];
    }
    return Array.from({ length: this.product.stock }, (_, i) => i + 1);
  }
}