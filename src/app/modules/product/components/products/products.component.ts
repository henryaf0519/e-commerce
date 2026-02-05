import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { InventoryService } from 'src/app/services/inventory-service.service'; // Importamos el servicio
import { CartState } from 'src/app/state/cart.reducer';
import { CartItem, SectionGroup } from 'src/app/models/cart-item.model';

interface SectionMetadata {
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  cart$: Observable<CartState>;
  totalPrice$: Observable<string>;

  sections$!: Observable<SectionGroup[]>;

  products: CartItem[] = [];
  loading: boolean = true;

  readonly SECTION_CONFIG: Record<string, SectionMetadata> = {
    'Harvest': {
      title: 'The Harvest',
      subtitle: 'Botanical & Heirloom',
      tagline: 'Rare botanical sweets. Gluten-free by nature. Ancient by tradition.',
      image: 'assets/imgs/harvest.png'
    },
    'Heritage': {
      title: 'The Heritage',
      subtitle: 'Rustic & Process-Driven',
      tagline: 'The Art of Patience. Hand-turned and fire-roasted.',
      image: 'assets/imgs/heritage.png'
    },
    'Comfort': {
      title: 'The Comfort',
      subtitle: 'Nostalgia & Gifting',
      tagline: 'Pure Pleasure. The flavors of home, elevated.',
      image: 'assets/imgs/comfort.png'
    },
    // Fallback para secciones desconocidas
    'default': {
      title: 'Our Collection',
      subtitle: 'Signature Selection',
      tagline: 'Crafted with passion for the discerning palate.',
      image: 'assets/imgs/hero.jpg'
    }
  };

  constructor(
    private cartService: CartService,
    private inventoryService: InventoryService,
    private router: Router
  ) {
    this.cart$ = this.cartService.getCartState();
    this.totalPrice$ = this.cart$.pipe(
      map((state) =>
        state.items
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)
      )
    );
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.sections$ = this.inventoryService.getVisibleProducts().pipe(
      map((products: CartItem[]) => this.groupProductsBySection(products))
    );
  }

private groupProductsBySection(products: CartItem[]): SectionGroup[] {
    const grouped = products.reduce((acc, product) => {
      // Normalizamos la key (ej: "  Harvest " -> "Harvest")
      const rawSection = product.section || 'default';
      const key = rawSection.trim(); 

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // Mapeamos a la estructura SectionGroup enriquecida
    return Object.keys(grouped).map(key => {
      // Intentamos buscar la config exacta, si no existe probamos lowercase, si no default
      const config = this.SECTION_CONFIG[key] 
                  || this.SECTION_CONFIG[key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()] // Intento de Capitalize
                  || this.SECTION_CONFIG['default'];

      return {
        id: key,
        displayTitle: config.title,
        subtitle: config.subtitle,
        tagline: config.tagline,
        bannerImage: config.image,
        products: grouped[key]
      };
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  onProductClicked(product: CartItem) {
    this.router.navigate(['products/detail'], {
      queryParams: { id: product.id },
      state: { productData: product },
    });
  }

  addToCartFromCard(productWithQuantity: any) {
    console.log('2A Adding to cart from ProductsComponent:', productWithQuantity);
   const item: CartItem = {
    ...productWithQuantity, 
    show: true,
    length: productWithQuantity.length, 
    width: productWithQuantity.width,
    height: productWithQuantity.height,
    weight: productWithQuantity.weight
  };
  console.log('🔍 [2B. ProductsComponent] Enviando al CartService:', {
      id: item.id,
      weight: item.weight,
      length: item.length
  });

  this.cartService.addToCart(item);
  }
}
