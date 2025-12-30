import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CheckoutService } from 'src/app/services/checkout.service';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart.selector';

@Component({
  selector: 'app-checkout-info',
  templateUrl: './checkout-info.component.html',
  styleUrls: ['./checkout-info.component.scss']
})
export class CheckoutInfoComponent {

  infoForm: FormGroup;
  cartItems$ = this.store.select(selectCartItems);
  totalPrice$ = this.store.select(selectTotalPrice);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private checkoutService: CheckoutService
  ) {
    this.infoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      apartment: [''],
      city: ['', Validators.required],
      country: ['Colombia', Validators.required],
      department: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.infoForm.valid) {
      
      this.checkoutService.setShippingAddress(this.infoForm.value);
      
      // Navegamos al siguiente paso
      this.router.navigate(['/checkout/shipping']);
    } else {
      this.infoForm.markAllAsTouched();
    }
  }

}
