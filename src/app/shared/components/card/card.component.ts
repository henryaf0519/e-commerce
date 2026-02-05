import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() products: any;
  @Output() productClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() addToCart: EventEmitter<any> = new EventEmitter<any>();
  quantity: number = 1;

  onCardClick() {
    this.productClicked.emit(this.products.id);
  }

  increaseQuantity(event: Event) {
    event.stopPropagation(); 
    if (this.products.stock > this.quantity) {
      this.quantity++;
    }
  }

  // Disminuir cantidad
  decreaseQuantity(event: Event) {
    event.stopPropagation();
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    console.log('Adding to cart from CardComponent:', this.products);
    
    this.addToCart.emit({ 
      ...this.products, 
      quantity: this.quantity 
    });
    
    this.quantity = 1; 
  }

}
