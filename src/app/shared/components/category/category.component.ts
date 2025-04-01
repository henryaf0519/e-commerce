import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  
  @Input() size: string[] = [];
  @Input() color: string[] = [];
  @Input() quantity: number | null = null;
  @Output() selectionChanged = new EventEmitter<{ size: string, color: string, quantity: number }>();

  quantityOptions: number[] = [];

  selectedSize: string | null = null;
  selectedColor: string | null = null;
  selectedQuantity: number | null = null;

  ngOnInit(): void {
    if (this.quantity !== null) {
      this.quantityOptions = Array.from({ length: this.quantity }, (_, i) => i + 1);
    }
  }
  selectSize(size: string): void {
    this.selectedSize = size;
    this.emitSelection();
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.emitSelection();
  }

  selectQuantity(quantity: number): void {
    this.selectedQuantity = quantity;
    this.emitSelection();
  }

  emitSelection(): void {

      this.selectionChanged.emit({
        size: this.selectedSize ?? '' ,
        color: this.selectedColor ?? '',
        quantity: this.selectedQuantity ?? 0
      });
    
  }
}
