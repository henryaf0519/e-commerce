import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CheckoutService } from 'src/app/services/checkout.service';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';
// 1. IMPORTAMOS LA LIBRERÍA
import { State, City, IState, ICity } from 'country-state-city';

@Component({
  selector: 'app-checkout-info',
  templateUrl: './checkout-info.component.html',
  styleUrls: ['./checkout-info.component.scss'],
})
export class CheckoutInfoComponent implements OnInit {
  infoForm: FormGroup;
  cartItems$ = this.store.select(selectCartItems);
  totalPrice$ = this.store.select(selectTotalPrice);

  // 2. VARIABLES PARA LAS LISTAS
  states: IState[] = [];
  cities: ICity[] = [];
  readonly COUNTRY_CODE = 'US'; // País fijo

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private checkoutService: CheckoutService
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
  }

  ngOnInit(): void {
    this.states = State.getStatesOfCountry(this.COUNTRY_CODE);
    const currentAddress = this.checkoutService.getShippingAddress();
    
    if (currentAddress) {
      if (currentAddress.state) {
        this.cities = City.getCitiesOfState(this.COUNTRY_CODE, currentAddress.state);
        this.infoForm.get('city')?.enable();
      }

      this.infoForm.patchValue(currentAddress);
    }
  }

  // 4. LÓGICA DE CAMBIO DE ESTADO
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
}