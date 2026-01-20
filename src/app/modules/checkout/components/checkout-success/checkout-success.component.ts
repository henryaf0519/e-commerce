import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from 'src/app/services/checkout.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  // Registration Logic
  registerForm: FormGroup;
  showRegister: boolean = false;
  isRegistered: boolean = false;
  isRegistering: boolean = false;
  
  // User Data
  userEmail: string = '';
  
  // Order Data (Tracking, Invoice, Items)
  orderData: any = null;

  constructor(
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // 1. Retrieve COMPLETE order data passed via router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.orderData = navigation.extras.state['orderResponse'];
      console.log('Order data received:', this.orderData);
    }
  }

  ngOnInit(): void {
    // 2. Try to get email from order data (Priority 1)
    if (this.orderData?.shipping?.email) {
       this.userEmail = this.orderData.shipping.email;
    } 
    // 3. If not, try to get it from service (Priority 2 - Fallback)
    else {
      const serviceData = this.checkoutService.getShippingAddress();
      if (serviceData) {
        this.userEmail = serviceData.email;
      } else {
        console.warn('No user data found for registration');
      }
    }

    // 4. Logic to show registration: Only if we have an email AND user is NOT logged in
    if (this.userEmail && !this.authService.isLoggedIn()) {
      this.showRegister = true;
    } else {
      this.showRegister = false;
    }

    // 5. Security: If no order and no email, typically redirect to home
    if (!this.orderData && !this.userEmail) {
        // Optional: Redirect if page is refreshed and state is lost
        // this.router.navigate(['/']);
    }
  }

  onCreateAccount() {
    debugger
    if (this.registerForm.valid && this.userEmail) {
      this.isRegistering = true;
      const { password } = this.registerForm.value;
      
      // Determine source of address data (Order data is preferred source of truth)
      // We handle potential nesting: orderData.shipping might be the address itself or contain an 'address' property
     
      const addressData = this.checkoutService.getShippingAddress();

      if (!addressData) {
        console.error('Missing address data for registration');
        this.isRegistering = false;
        return;
      }

      // Construct the payload matching the required cURL format
      const registerPayload = {
        email: this.userEmail,
        password: password,
        name: addressData.name,
        street1: addressData.street1,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        country: addressData.country || 'US',
        phone: addressData.phone,
        businessId: environment.businessId
      };

      console.log('Registering user with payload:', registerPayload);

      this.authService.register(registerPayload).subscribe({
        next: (res) => {
          console.log('Registration successful:', res);
          this.isRegistered = true;
          this.showRegister = false;
          this.isRegistering = false;
          // Optional: You could auto-login the user here if the token is returned
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.isRegistering = false;
          // Handle UI error display if necessary
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up temporary service data
    this.checkoutService.setShippingAddress(null as any); 
  }
}