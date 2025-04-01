import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
      console.log('ID del producto:', this.productId);
    });
  }

  // Handle the selection change from the app-category component
  handleSelectionChange(selection: { size: string, color: string, quantity: number }): void {
    this.selectedOptions = selection;
    console.log('Selected Options:', this.selectedOptions);
  }

  // Handle "Add to Cart" click
  addToCart(): void {
    if (this.selectedOptions) {
      console.log('Adding to cart:', this.selectedOptions);
      // Aquí puedes agregar lógica para agregar al carrito.
    } else {
      alert('Please select size, color, and quantity.');
    }
  }
}
