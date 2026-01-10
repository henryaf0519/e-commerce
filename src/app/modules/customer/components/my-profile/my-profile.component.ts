import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs';
import { State, City, IState, ICity } from 'country-state-city';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Variables para listas (Igual que en Checkout)
  states: IState[] = [];
  cities: ICity[] = [];
  readonly COUNTRY_CODE = 'US';

  // Estados visuales
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isProfileLoading = false;
  isPasswordLoading = false;
  
  profileMessage: { type: 'success' | 'error', text: string } | null = null;
  passwordMessage: { type: 'success' | 'error', text: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }], // Deshabilitado visualmente
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      street1: ['', Validators.required],
      state: [null, Validators.required],
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
    this.states = State.getStatesOfCountry(this.COUNTRY_CODE);

    this.authService.currentUser$.pipe(first()).subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          street1: user.address?.street1 || '',
          zip: user.address?.zip || '',
          country: 'US'
        });

        if (user.address?.state) {
          this.cities = City.getCitiesOfState(this.COUNTRY_CODE, user.address.state);
          this.profileForm.get('city')?.enable();
          
          this.profileForm.patchValue({
            state: user.address.state,
            city: user.address.city
          });
        }
      }
    });
  }

  onStateChange(): void {
    const stateIsoCode = this.profileForm.get('state')?.value;

    if (stateIsoCode) {
      this.cities = City.getCitiesOfState(this.COUNTRY_CODE, stateIsoCode);
      this.profileForm.get('city')?.enable();
      this.profileForm.get('city')?.setValue(null);
    } else {
      this.cities = [];
      this.profileForm.get('city')?.disable();
      this.profileForm.get('city')?.setValue(null);
    }
  }

  // Lógica para guardar el perfil (CORREGIDA)
  onSaveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.isProfileLoading = true;
    this.profileMessage = null;

    // 1. Obtenemos todos los valores (incluidos los deshabilitados como Country)
    const rawData = this.profileForm.getRawValue();

    // 2. Extraemos el email y nos quedamos con el resto (updateData)
    // Esto crea un nuevo objeto 'updateData' que tiene todo EXCEPTO el email
    const { email, ...updateData } = rawData;

    console.log('Enviando datos (sin email):', updateData); // Para depurar

    this.authService.updateProfile(updateData).subscribe({
      next: () => {
        this.isProfileLoading = false;
        this.profileMessage = { type: 'success', text: 'Profile updated successfully!' };
        setTimeout(() => this.profileMessage = null, 3000);
      },
      error: (err) => {
        console.error(err);
        this.isProfileLoading = false;
        this.profileMessage = { type: 'error', text: 'Failed to update profile.' };
      }
    });
  }

  // --- Helpers de Password (sin cambios) ---
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirm = form.get('confirmPassword');
    return password && confirm && password.value === confirm.value 
      ? null : { mismatch: true };
  }

  toggleCurrentPassword() { this.showCurrentPassword = !this.showCurrentPassword; }
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  onChangePassword() {
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