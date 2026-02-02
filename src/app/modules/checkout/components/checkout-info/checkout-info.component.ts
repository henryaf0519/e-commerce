import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CheckoutService } from 'src/app/services/checkout.service';
import { AuthService } from 'src/app/services/auth.service'; // <--- IMPORTADO
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';
import { State, City, IState, ICity } from 'country-state-city';

@Component({
  selector: 'app-checkout-info',
  templateUrl: './checkout-info.component.html',
  styleUrls: ['./checkout-info.component.scss'],
})
export class CheckoutInfoComponent implements OnInit {
  infoForm: FormGroup;
  
  // Selectores de NgRx (INTACTOS)
  cartItems$ = this.store.select(selectCartItems);
  totalPrice$ = this.store.select(selectTotalPrice);

  // Variables para listas (INTACTOS)
  states: IState[] = [];
  cities: ICity[] = [];
  readonly COUNTRY_CODE = 'US';

  // === NUEVAS VARIABLES PARA EL MODAL DE LOGIN ===
  isLoginModalOpen = false;
  loginForm: FormGroup;
  isLoadingLogin = false;
  loginError = '';
  // ===============================================

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private checkoutService: CheckoutService,
    private authService: AuthService // <--- INYECCIÓN
  ) {
    this.infoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      street1: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      state: ['', Validators.required],
      zip: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      ],
      country: ['US', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });

    // === NUEVO FORMULARIO DE LOGIN ===
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.states = State.getStatesOfCountry(this.COUNTRY_CODE);
    
    // Revisar si ya hay datos en el servicio (INTACTO)
    const currentAddress = this.checkoutService.getShippingAddress();
    
    // Si no hay datos en el checkoutService, intentamos ver si el usuario ya está logueado en AuthService
    if (currentAddress) {
      this.fillFormWithData(currentAddress);
    } else if (this.authService.isLoggedIn()) {
       // Opcional: Si el usuario llega a esta página ya logueado, pre-llenar
       const user = this.authService['currentUserSubject'].value; // Acceso directo al subject si es público o usar un getter
       if(user) this.fillFormWithUserData(user);
    }
  }

  // Helper para reutilizar la lógica de llenado (Respetando country-state-city)
  private fillFormWithData(data: any) {
    if (data.state) {
      this.cities = City.getCitiesOfState(this.COUNTRY_CODE, data.state);
      this.infoForm.get('city')?.enable();
    }
    this.infoForm.patchValue(data);
  }

  // Lógica de cambio de estado manual (INTACTO)
  onStateChange(): void {
    const stateIsoCode = this.infoForm.get('state')?.value;

    if (stateIsoCode) {
      this.cities = City.getCitiesOfState(this.COUNTRY_CODE, stateIsoCode);
      this.infoForm.get('city')?.enable();
      this.infoForm.get('city')?.setValue('');
    } else {
      this.cities = [];
      this.infoForm.get('city')?.disable();
      this.infoForm.get('city')?.setValue('');
    }
  }

  onSubmit() {
    if (this.infoForm.valid) {
      this.checkoutService.setShippingAddress(this.infoForm.getRawValue());
      this.router.navigate(['/checkout/shipping']);
    } else {
      this.infoForm.markAllAsTouched();
    }
  }

  // =========================================================
  // LÓGICA DEL MODAL (NUEVO)
  // =========================================================
  
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.loginError = '';
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
    this.loginForm.reset();
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoadingLogin = true;
    this.loginError = '';
    const credentials = this.loginForm.value;

    this.authService.login(credentials, false).subscribe({
      next: (response) => {
        this.isLoadingLogin = false;
        this.closeLoginModal();
        
        // AQUÍ OCURRE LA MAGIA: Autocompletar con los datos del usuario
        if (response.user) {
          this.fillFormWithUserData(response.user);
        }
      },
      error: (err) => {
        this.isLoadingLogin = false;
        this.loginError = 'Credenciales inválidas.';
      }
    });
  }

  private fillFormWithUserData(user: any) {
    const addressData = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      street1: user.address?.street1 || '',
      zip: user.address?.zip || '',
      state: user.address?.state || '',
      city: user.address?.city || '',
      country: 'US'
    };
    this.fillFormWithData(addressData);
  }
}