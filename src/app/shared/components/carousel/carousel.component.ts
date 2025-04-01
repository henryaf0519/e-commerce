import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  @Input() images: string[] = []; 
  currentIndex: number = 0; 

  constructor() { }

  ngOnInit(): void {
    if (this.images.length === 0) {

    }
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length; 
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length; 
  }
}
