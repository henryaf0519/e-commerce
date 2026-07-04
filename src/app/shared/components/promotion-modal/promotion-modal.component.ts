import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-promotion-modal',
  templateUrl: './promotion-modal.component.html'
})
export class PromotionModalComponent {
  @Input() promotionData: any;
  @Output() close = new EventEmitter<void>();

  email: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private promotionService: PromotionService) { }

  sendPromotion() {
    this.loading = true;
    this.errorMessage = null; // Reiniciamos error

    this.promotionService.sendPromotionToEmail(this.email, this.promotionData.code, this.promotionData.percentage).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Success! The code has been sent to your email.';

        // Esperamos 2 segundos para que el usuario lea el mensaje y luego cerramos
        setTimeout(() => {
          this.close.emit();
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        // Si el error es 409 (Conflict)
        if (err.status === 409 || err.error?.error === 'PROMOTION_ALREADY_REQUESTED') {
          this.errorMessage = 'This code has already been requested for this email address.';

          // Esperar 3 segundos y cerrar todo
          setTimeout(() => {
            this.close.emit();
          }, 3000);
        } else {
          this.errorMessage = 'An unexpected error occurred, please try again.';
        }
      }
    });
  }
}