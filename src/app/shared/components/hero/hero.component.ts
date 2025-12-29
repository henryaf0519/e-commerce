import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() title: string = 'Dulcilandia';
  @Input() subtitle: string = 'Descubre los sabores que te harán sonreír.';

  scrollToCatalogo(event: Event) {
    event.preventDefault();
    const element = document.getElementById('catalogo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
