import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
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
  products = [
    {
      id:1,
      name: "Men's Ankle Boots",
      description: 'Vintage Fashion, Minimalist Solid Color, Round Toe Slip-on Short Boots with PU Upper, Fabric Lining, and Rubber Sole for Casual and Business Casual Outfits.',
      price: 100,
      image: 'assets/imgs/gorra.webp',
      isNew:true
    },
    {
      id:2,
      name: 'Product 2',
      description: 'Description of Product 2',
      price: 200,
      image: 'assets/imgs/zapatos.webp',
      isNew:true
    },
    {
      id:3,
      name: 'Product 3',
      description: 'Description of Product 3',
      price: 300,
      image: 'https://via.placeholder.com/150',
      isNew:false
    },
    {
      id:4,
      name: 'Product 4',
      description: 'Description of Product 4',
      price: 400,
      image: 'https://via.placeholder.com/150',
      isNew:false
    },
    {
      id:5,
      name: 'Product 5',
      description: 'Description of Product 5',
      price: 500,
      image: 'https://via.placeholder.com/150',
      isNew:false
    },
    {
      id:6,
      name: 'Product 6',
      description: 'Description of Product 6',
      price: 600,
      image: 'https://via.placeholder.com/150',
      isNew:false
    },
  ];
  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.getCartState();
  }

  ngOnInit(): void {
    this.cart$.subscribe(cart => {
      this.cartItems = cart.items;
    });
  }

  totalCartPrice() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }


  onProductClicked(id: string) {
    this.router.navigate(['products/detail'], { queryParams: { id } });
  }

}
