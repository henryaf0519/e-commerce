import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/card/card.component';
import { CarouselComponent } from './components/carousel/carousel.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule
    
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    CarouselComponent
  ]
})
export class SharedModule { }
