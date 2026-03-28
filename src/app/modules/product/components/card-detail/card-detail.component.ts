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
  // --- VARIABLES DE ESTADO ---
  showModal: boolean = false;
  message: string = '';
  productId: string | null = null;
  product: CartItem | null = null;
  loading: boolean = true;

  // Venta cruzada: Productos de la misma sección
  relatedProducts: CartItem[] = [];

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

  // Control de los acordeones de información
  accordions = {
    description: true,
    ingredients: false,
    shipping: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private cartService: CartService,
    private inventoryService: InventoryService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['productData']) {
      this.product = navigation.extras.state['productData'] as CartItem;
      this.productId = this.product.id;

      if (this.product.images?.length) {
        this.mainImage = this.product.images[0];
      }
      this.loading = false;
    }
  }

  ngOnInit(): void {
    // Escuchamos cambios en los queryParams para permitir navegación entre productos
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.productId = params['id'];
        if (this.productId) {
          this.loadProduct(this.productId);
        }
      } else if (!this.product) {
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

        // Cargamos feedbacks y productos relacionados
        this.loadFeedbacks(id);
        if (this.product?.section) {
          this.loadRelatedProducts(this.product.section, id);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando el producto:', err);
        this.loading = false;
      },
    });
  }

  // --- LÓGICA DE VENTA CRUZADA ---
  loadRelatedProducts(section: string, currentId: string): void {
    this.inventoryService.getVisibleProducts().subscribe({
      next: (products) => {
        // Filtramos por sección y excluimos el producto actual
        this.relatedProducts = products
          .filter((p) => p.section === section && p.id !== currentId)
          .slice(0, 4); // Limitamos a 4 para el diseño
      },
      error: (err) => console.error('Error cargando relacionados:', err),
    });
  }

  // Acción al hacer clic en un producto relacionado
  onProductClicked(relatedProduct: CartItem): void {
    this.router
      .navigate(['products/detail'], {
        queryParams: { id: relatedProduct.id },
        state: { productData: relatedProduct },
      })
      .then(() => {
        // Forzamos el scroll al inicio y recargamos la vista
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  loadFeedbacks(id: string): void {
    this.inventoryService.getFeedbacks(id).subscribe({
      next: (data) => {
        this.feedbacks = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      },
      error: (err) => console.error('Error al cargar comentarios:', err),
    });
  }

  // --- MÉTODOS DE INTERFAZ ---
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

  decreaseQuantity(): void {
    if (this.selectedOptions.quantity > 1) {
      this.selectedOptions.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && this.selectedOptions.quantity > 0) {
      const item: CartItem = {
        ...this.product,
        quantity: this.selectedOptions.quantity,
        show: true,
      };
      this.cartService.addToCart(item);
      this.showModal = true;
      this.message = '¡Producto agregado al carrito!';
    }
  }

  // Para el evento del componente app-card en relacionados
  addToCartFromCard(productWithQuantity: any): void {
    this.cartService.addToCart(productWithQuantity);
    this.showModal = true;
    this.message = '¡Producto agregado al carrito!';
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  submitFeedback(): void {
    if (!this.newComment.trim() || !this.productId) return;

    this.isSubmittingFeedback = true;
    const payload = {
      comment: this.newComment,
      customerName: this.newCustomerName.trim() || 'Anónimo',
    };

    this.inventoryService.addFeedback(this.productId, payload).subscribe({
      next: (res) => {
        this.feedbacks.unshift({
          ...payload,
          createdAt: new Date().toISOString(),
        });
        this.newComment = '';
        this.newCustomerName = '';
        this.isSubmittingFeedback = false;
      },
      error: (err) => {
        console.error('Error al enviar comentario:', err);
        this.isSubmittingFeedback = false;
      },
    });
  }
}
