import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/card/card.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CategoryComponent } from './components/category/category.component';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    CarouselComponent,
    CategoryComponent,
    AdminHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule
    
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    CarouselComponent,
    CategoryComponent,
    AdminHeaderComponent
  ]
})
export class SharedModule { }
