import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // En un escenario real se implementaría la autenticación
    console.log('Logging in with', this.email);
    this.router.navigate(['/products']);
  }
}
