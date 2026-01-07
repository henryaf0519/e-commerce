import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  // Lógica de Registro
  registerForm: FormGroup;
  showRegister: boolean = false;
  isRegistered: boolean = false;
  
  // Datos del Usuario
  userEmail: string = '';
  
  // Datos de la Orden (Tracking, Invoice, Items)
  orderData: any = null;

  constructor(
    private checkoutService: CheckoutService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      // Eliminé confirmPassword para simplificar UI, pero puedes agregarlo si gustas
    });

    // 1. Recuperamos los datos COMPLETOS de la orden que enviamos desde el componente anterior
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.orderData = navigation.extras.state['orderResponse'];
      console.log('Datos de orden recibidos:', this.orderData);
    }
  }

  ngOnInit(): void {
    // 2. Intentamos obtener el email de los datos de la orden (Prioridad 1)
    if (this.orderData?.shipping?.email) {
       this.userEmail = this.orderData.shipping.email;
       this.showRegister = true;
    } 
    // 3. Si no, intentamos obtenerlo del servicio (Prioridad 2 - Fallback)
    else {
      const serviceData = this.checkoutService.getShippingAddress();
      if (serviceData) {
        this.userEmail = serviceData.email;
        this.showRegister = true;
      } else {
        console.warn('No se encontraron datos de usuario para registro');
      }
    }

    // 4. Seguridad: Si no hay orden ni email, volver al inicio
    if (!this.orderData && !this.userEmail) {
        // Opcional: Descomentar si quieres redirigir a usuarios que refrescan la página
        // this.router.navigate(['/']);
    }
  }

  onCreateAccount() {
    if (this.registerForm.valid && this.userEmail) {
      const { password } = this.registerForm.value;
      console.log('CREANDO CUENTA PARA:', this.userEmail, 'PASS:', password);
      
      // Aquí llamarías a tu AuthService.register()
      
      this.isRegistered = true;
      this.showRegister = false;
    }
  }

  ngOnDestroy(): void {
    // Limpiamos la data temporal del servicio
    this.checkoutService.setShippingAddress(null as any); 
  }
}