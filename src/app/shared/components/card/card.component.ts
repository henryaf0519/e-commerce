import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() products: any;
  @Output() productClicked: EventEmitter<string> = new EventEmitter<string>();

  onCardClick() {
    this.productClicked.emit(this.products.id); // Emitimos el nombre del producto
  }

}
