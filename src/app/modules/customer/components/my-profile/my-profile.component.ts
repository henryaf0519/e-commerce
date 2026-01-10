import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs';
// 1. IMPORTAR LA LIBRERÍA
import { State, City, IState, ICity } from 'country-state-city';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Estados visuales
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isProfileLoading = false;
  isPasswordLoading = false;
  
  profileMessage: { type: 'success' | 'error', text: string } | null = null;
  passwordMessage: { type: 'success' | 'error', text: string } | null = null;

  // 2. VARIABLES PARA LAS LISTAS (Igual que en Checkout)
  states: IState[] = [];
  cities: ICity[] = [];
  readonly COUNTRY_CODE = 'US'; // País fijo por ahora

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // 3. CONFIGURAR FORMULARIO (City deshabilitado al inicio)
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      street1: ['', Validators.required],
      
      // Selectores dinámicos
      state: [null, Validators.required], // Usamos null para ng-select
      city: [{ value: null, disabled: true }, Validators.required], 
      
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      country: ['US', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // 4. CARGAR ESTADOS AL INICIAR
    this.states = State.getStatesOfCountry(this.COUNTRY_CODE);

    this.authService.currentUser$.pipe(first()).subscribe(user => {
      if (user) {
        // Cargar datos básicos
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          street1: user.address?.street1 || '',
          zip: user.address?.zip || '',
          country: 'US' // Fijo
        });

        // 5. LÓGICA PARA CARGAR CIUDADES SI YA TIENE ESTADO
        if (user.address?.state) {
          // Buscamos el estado por ISO Code (ej: "TX")
          this.cities = City.getCitiesOfState(this.COUNTRY_CODE, user.address.state);
          this.profileForm.get('city')?.enable();
          
          // Patch de Estado y Ciudad
          this.profileForm.patchValue({
            state: user.address.state,
            city: user.address.city
          });
        }
      }
    });
  }

  // 6. LÓGICA DE CAMBIO DE ESTADO (Copiada de Checkout)
  onStateChange(): void {
    const stateIsoCode = this.profileForm.get('state')?.value;

    if (stateIsoCode) {
      this.cities = City.getCitiesOfState(this.COUNTRY_CODE, stateIsoCode);
      this.profileForm.get('city')?.enable();
      this.profileForm.get('city')?.setValue(null); // Resetear ciudad al cambiar estado
    } else {
      this.cities = [];
      this.profileForm.get('city')?.disable();
      this.profileForm.get('city')?.setValue(null);
    }
  }

  // ... (Resto de métodos: passwordMatchValidator, toggles, onSaveProfile, onChangePassword igual que antes) ...
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirm = form.get('confirmPassword');
    return password && confirm && password.value === confirm.value 
      ? null : { mismatch: true };
  }

  toggleCurrentPassword() { this.showCurrentPassword = !this.showCurrentPassword; }
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  onSaveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isProfileLoading = true;
    this.profileMessage = null;
    const updateData = this.profileForm.getRawValue();

    this.authService.updateProfile(updateData).subscribe({
      next: () => {
        this.isProfileLoading = false;
        this.profileMessage = { type: 'success', text: 'Profile updated successfully!' };
        setTimeout(() => this.profileMessage = null, 3000);
      },
      error: (err) => {
        this.isProfileLoading = false;
        this.profileMessage = { type: 'error', text: 'Failed to update profile.' };
      }
    });
  }

  onChangePassword() {
    // ... (igual que tu código anterior)
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.isPasswordLoading = true;
    this.passwordMessage = null;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
        next: () => {
            this.isPasswordLoading = false;
            this.passwordMessage = { type: 'success', text: 'Password changed successfully!' };
            this.passwordForm.reset();
            setTimeout(() => this.passwordMessage = null, 3000);
        },
        error: (err) => {
            this.isPasswordLoading = false;
            this.passwordMessage = { type: 'error', text: 'Incorrect current password.' };
        }
    });
  }
}