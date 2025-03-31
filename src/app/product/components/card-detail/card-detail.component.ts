import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarouselComponent } from "../../../shared/components/carousel/carousel.component";

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent implements OnInit {
  
  productId: string | null = null;
  product = {
    name: "Men's Ankle Boots",
    description: "Vintage Fashion, Minimalist Solid Color, Round Toe Slip-on Short Boots with PU Upper, Fabric Lining, and Rubber Sole for Casual and Business Casual Outfits.",
    price: 79.99,
    images: [
      "https://img.kwcdn.com/product/fancy/d783740f-696f-4243-a574-bf3c783e7ca7.jpg",
      "https://img.kwcdn.com/product/fancy/d783740f-696f-4243-a574-bf3c783e7ca7.jpg",
      "https://img.kwcdn.com/product/fancy/d783740f-696f-4243-a574-bf3c783e7ca7.jpg"
    ]
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la URL (si es necesario)
    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
      console.log('ID del producto:', this.productId);
    });
  }
}
