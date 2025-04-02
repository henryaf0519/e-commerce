import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addToCart, removeFromCart, updateQuantity } from '../../../state/cart.actions';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {
  
  productId: string | null = null;
  product = {
    id: '1',
    name: "Men's Ankle Boots",
    description: "Vintage Fashion, Minimalist Solid Color, Round Toe Slip-on Short Boots with PU Upper, Fabric Lining, and Rubber Sole for Casual and Business Casual Outfits.",
    price: 79.99,
    size: ["S", "M", "L"],
    color: ["Red", "Blue", "Green"],
    quantity: 5,
    images: [
      "https://img.kwcdn.com/product/fancy/d783740f-696f-4243-a574-bf3c783e7ca7.jpg",
      "https://img.kwcdn.com/product/fancy/d783740f-696f-4243-a574-bf3c783e7ca7.jpg",
      "https://img.kwcdn.com/product/fancy/d783740f-696f-4243-a574-bf3c783e7ca7.jpg"
    ]
  };

  selectedOptions: { size: string, color: string, quantity: number } | null = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
      console.log('ID del producto:', this.productId);
    });
  }

  // Handle the selection change from the app-category component
  handleSelectionChange(selection: { size: string, color: string, quantity: number }): void {
    this.selectedOptions = selection;
  }

  // Handle "Add to Cart" click
  addToCart(): void {
    if (this.selectedOptions && this.selectedOptions.quantity > 0 && this.productId !== null) {
      const item = {
        id: this.productId ?? '',
        name: this.product.name,
        size: this.selectedOptions.size,
        color: this.selectedOptions.color,
        quantity: this.selectedOptions.quantity,
        price: this.product.price
      };
      console.log('Item a agregar al carrito:', item);
      this.cartService.addToCart(item);
      this.router.navigate(['products']);
    } else {
      alert('Please select size, color, and quantity.');
    } 
  }

  removeFromCart(itemId: string): void {
    this.store.dispatch(removeFromCart({ itemId})); 
  }

  updateQuantity(itemId: string, size: string, color: string, quantity: number): void {
    this.store.dispatch(updateQuantity({ itemId, size, color, quantity })); 
  }
}
