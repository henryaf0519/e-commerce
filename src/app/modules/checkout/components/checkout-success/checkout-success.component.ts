import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from 'src/app/services/checkout.service';
import { AuthService } from 'src/app/services/auth.service'; // Import AuthService
import { Router } from '@angular/router';

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
  
  // User Data
  userEmail: string = '';
  
  // Order Data (Tracking, Invoice, Items)
  orderData: any = null;

  constructor(
    private checkoutService: CheckoutService,
    private authService: AuthService, // Inject AuthService
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword removed to simplify UI, can be added if needed
    });

    // 1. Retrieve COMPLETE order data sent from the previous component
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

    // Logic to show registration only if user is NOT logged in and we have an email
    // Uses AuthService.isLoggedIn()
    if (this.userEmail && !this.authService.isLoggedIn()) {
      this.showRegister = true;
    } else {
      this.showRegister = false;
    }

    // 4. Security: If no order and no email, return to home
    if (!this.orderData && !this.userEmail) {
        // Optional: Uncomment if you want to redirect users who refresh the page
        // this.router.navigate(['/']);
    }
  }

  onCreateAccount() {
    if (this.registerForm.valid && this.userEmail) {
      const { password } = this.registerForm.value;
      console.log('CREATING ACCOUNT FOR:', this.userEmail, 'PASS:', password);
      
      // Here you would call your AuthService.register() method
      
      this.isRegistered = true;
      this.showRegister = false;
    }
  }

  ngOnDestroy(): void {
    // Clear temporary service data
    this.checkoutService.setShippingAddress(null as any); 
  }
}