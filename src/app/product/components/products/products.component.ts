import { Component } from '@angular/core';
import { SharedModule } from "../../../shared/shared.module";
import { CardComponent } from "../../../shared/components/card/card.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products = [
    {
      id:1,
      name: 'Product 1',
      description: 'Description of Product 1',
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
  constructor(private router: Router) {}

  onProductClicked(id: string) {
    console.log('Producto clickeado:', id);
    this.router.navigate(['products/detail'], { queryParams: { id } });
    // Aquí puedes hacer lo que necesites con el nombre del producto
  }

}
