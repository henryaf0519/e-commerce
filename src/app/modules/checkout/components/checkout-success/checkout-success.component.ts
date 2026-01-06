import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from 'src/app/services/checkout.service'; // <--- USAMOS TU SERVICIO
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  showRegister: boolean = false;
  isRegistered: boolean = false;
  
  userEmail: string = '';
  userName: string = '';

  constructor(
    private checkoutService: CheckoutService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 1. Recuperar datos del comprador del SERVICIO
    const data = this.checkoutService.getShippingAddress();
    
    if (data) {
      this.userEmail = data.email;
    //  this.userName = data.firstName;
      this.showRegister = true;
    } else {

      console.warn('No se encontraron datos de compra temporal');
    }
  }

  onCreateAccount() {
    if (this.registerForm.valid && this.userEmail) {
      const { password } = this.registerForm.value;
      console.log('CREANDO CUENTA PARA:', this.userEmail, 'PASS:', password);
      
      this.isRegistered = true;
      this.showRegister = false;
    }
  }

  ngOnDestroy(): void {
    this.checkoutService.setShippingAddress(null as any); 
  }
}