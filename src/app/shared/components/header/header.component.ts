import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) {}
  isUserMenuOpen = false;

  // Método para alternar la visibilidad del menú
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  goToHome(){
    this.router.navigate(['/products']);
  }
}
