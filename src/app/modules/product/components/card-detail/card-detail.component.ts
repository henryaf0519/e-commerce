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

  mainImage: string = '';
  feedbacks: any[] = [];
  newComment: string = '';
  newCustomerName: string = '';
  isSubmittingFeedback: boolean = false;
  
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
      debugger
      if (params['id']) {
        this.productId = params['id'];
      }
      if (this.productId) {
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
        if (this.product?.images?.length) {
          this.mainImage = this.product.images[0];
        }
        this.loading = false;
        this.loadFeedbacks(id);
      },
      error: (err) => {
        console.error('Error cargando el producto:', err);
        this.loading = false;
      },
    });
  }

  loadFeedbacks(id: string): void {
    this.inventoryService.getFeedbacks(id).subscribe({
      next: (data) => {
        this.feedbacks = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => console.error('Error al cargar comentarios:', err)
    });
  }

  changeImage(img: string): void {
    this.mainImage = img;
  }

  toggleAccordion(section: 'description' | 'ingredients' | 'shipping'): void {
    this.accordions[section] = !this.accordions[section];
  }

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
        ...this.product, 
        quantity: this.selectedOptions.quantity,
        length: this.product.length,
        width: this.product.width,
        height: this.product.height,
        weight: this.product.weight,
        show: true
      };

       console.log('Adding to cart from CardDetailComponent:', item);

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


  submitFeedback(): void {
    if (!this.newComment.trim() || !this.productId) return;

    this.isSubmittingFeedback = true;
    const payload = {
      comment: this.newComment,
      customerName: this.newCustomerName.trim() || 'Anónimo'
    };

    this.inventoryService.addFeedback(this.productId, payload).subscribe({
      next: (res) => {
        // Agregamos el nuevo comentario a la lista localmente para no recargar
        this.feedbacks.unshift({
          ...payload,
          createdAt: new Date().toISOString()
        });
        
        // Limpiamos el formulario
        this.newComment = '';
        this.newCustomerName = '';
        this.isSubmittingFeedback = false;
      },
      error: (err) => {
        console.error('Error al enviar comentario:', err);
        this.isSubmittingFeedback = false;
      }
    });
  }
}