import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() buttonText: string = 'Ver Catálogo';
  @Input() backgroundImage: string = 'assets/imgs/hero.png';
  @Input() fullHeight: boolean = true; // Controla si ocupa toda la pantalla

  scrollToCatalogo(event: Event, name: string): void {
    console.log('scrollToCatalogo called');
    event.preventDefault();
    const element = document.getElementById(name);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  
}