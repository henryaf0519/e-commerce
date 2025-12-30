import { Component, OnInit } from '@angular/core';
// 1. IMPORTANTE: Importamos 'Event' como 'RouterEvent' para evitar el conflicto
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators'; // Nota: filter suele importarse de 'rxjs/operators' o 'rxjs' dependiendo de la versión, pero mantén la que te funcione.
import { openCartSidebar } from 'src/app/state/cart.actions';
import { selectTotalItems } from 'src/app/state/cart.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  // Asumo que tu store está tipado genéricamente, si tienes un AppState úsalo aquí
  totalItems$ = this.store.select(selectTotalItems);
  isHomePage: boolean = false;

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkIfHomePage(this.router.url);

    this.router.events.pipe(
      // 2. CORRECCIÓN: Usamos 'RouterEvent' en lugar de 'Event'
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
       this.checkIfHomePage(event.urlAfterRedirects);
    });
  }

  private checkIfHomePage(url: string) {
    this.isHomePage = url === '/' || url === '/home' || url.includes('products');
  }

  handleCartClick() {
    if (this.isHomePage) {
      this.store.dispatch(openCartSidebar());
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

}