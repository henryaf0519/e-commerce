import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CartService } from 'src/app/services/cart.service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms 0s ease-in', style({ opacity: 1}))
      ]),
      transition(':leave', [
        animate('200ms 0s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CardDetailComponent implements OnInit {

  showModal: boolean = false;
  message: string = '';
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
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
      console.log('ID del producto:', this.productId);
    });
  }

  handleSelectionChange(selection: { size: string, color: string, quantity: number }): void {
    this.selectedOptions = selection;
  }

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
      this.showModal = true;
      this.message = 'Producto agregado al carrito!';
      setTimeout(() => {
        this.showModal = false;
      }, 3000);
    } else {
      alert('Please select size, color, and quantity.');
    } 
  }
}
