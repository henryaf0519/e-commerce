import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, forkJoin } from 'rxjs'; // Importamos forkJoin
import { CartService } from 'src/app/services/cart.service';
import { InventoryService } from 'src/app/services/inventory-service.service';
import { SectionsService } from 'src/app/services/sections.service'; // Importamos el servicio de secciones
import { CartState } from 'src/app/state/cart.reducer';
import { CartItem, SectionGroup } from 'src/app/models/cart-item.model';

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

  // ¡SECTION_CONFIG ha sido eliminado!

  constructor(
    private cartService: CartService,
    private inventoryService: InventoryService,
    private sectionsService: SectionsService, // Inyectamos el servicio
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
    // Usamos forkJoin para esperar a que ambas peticiones (productos y secciones) terminen
    this.sections$ = forkJoin({
      products: this.inventoryService.getVisibleProducts(),
      sectionsData: this.sectionsService.getSections()
    }).pipe(
      map(({ products, sectionsData }) => this.groupProductsBySection(products, sectionsData))
    );
  }

  // Ahora recibimos también la data de las secciones desde la BD
  private groupProductsBySection(products: CartItem[], sectionsData: any[]): SectionGroup[] {
    
    // 1. Convertimos el array de secciones de la BD en un diccionario (Map) 
    // para buscar más rápido usando el título en minúsculas.
    const sectionConfigMap = sectionsData.reduce((acc, sec) => {
      // Usamos title o name como clave de búsqueda (todo en minúscula para evitar errores)
      const key = (sec.title || sec.name || '').toLowerCase().trim();
      acc[key] = sec;
      return acc;
    }, {} as Record<string, any>);

    // 2. Agrupamos los productos por su propiedad 'section'
    const grouped = products.reduce((acc, product) => {
      const rawSection = product.section || 'default';
      const key = rawSection.trim(); 

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // 3. Construimos el arreglo final de SectionGroup
    return Object.keys(grouped).map(key => {
      
      // Buscamos la configuración de la sección en nuestro diccionario
      // (Convertimos a minúscula para asegurar la coincidencia exacta)
      const config = sectionConfigMap[key.toLowerCase()];

      return {
        id: key,
        // Si encontramos la configuración en BD, usamos sus valores; 
        // de lo contrario, aplicamos un fallback por defecto
        displayTitle: config?.title || key,
        subtitle: config?.subtitle || 'Signature Selection',
        tagline: config?.tagline || 'Crafted with passion for the discerning palate.',
        bannerImage: config?.image || 'assets/imgs/hero.jpg', // Imagen por defecto si no tiene
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