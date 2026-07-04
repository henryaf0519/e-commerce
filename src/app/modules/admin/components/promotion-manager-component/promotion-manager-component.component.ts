import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-promotion-manager-component',
  templateUrl: './promotion-manager-component.component.html',
  styleUrls: ['./promotion-manager-component.component.scss']
})
export class PromotionManagerComponentComponent {
  allPromotions: any[] = [];
  promotionForm!: FormGroup;
  loading = false;
  selectedFile: File | null = null;
  preview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private promoService: PromotionService
  ) { }

  ngOnInit(): void {
    this.promotionForm = this.fb.group({
      title: ['', Validators.required],
      code: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
    this.loadAllPromotions();
    // Aquí cargarías la promoción actual (GET /promotion/active)
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.preview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.preview = null;
  }

  loadAllPromotions(): void {
    this.promoService.getAllPromotions().subscribe({
      next: (data) => {
        // Ordenamos para que la activa salga de primera (opcional)
        this.allPromotions = data.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
      }
    });
  }

 savePromotion() {
  if (this.promotionForm.invalid) return;

  this.loading = true;
  const formData = new FormData();
  const formValue = this.promotionForm.value;

  // 1. Agrega cada campo explícitamente
  formData.append('title', formValue.title);
  formData.append('code', formValue.code);
  formData.append('startDate', formValue.startDate);
  formData.append('endDate', formValue.endDate);
  formData.append('percentage', formValue.percentage.toString()); 

  // 2. IMPORTANTE: Usa el mismo nombre que espera tu backend para la imagen
  // Revisa si tu backend espera 'files', 'image', 'banner' o 'file'
  if (this.selectedFile) {
    formData.append('files', this.selectedFile); // Cambié 'files' a 'image' por si acaso
  }

  // 3. Envío
  this.promoService.savePromotion(formData).subscribe({
    next: () => {
      this.loading = false;
      alert('Promoción guardada');
      this.loadAllPromotions();
    },
    error: (err) => {
      this.loading = false;
      console.error('Error:', err);
    }
  });
}
  activatePromotion(promo: any): void {
    this.loading = true;
    this.promoService.toggleActive(promo.code).subscribe({
      next: () => {
        this.loadAllPromotions();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Error al actualizar el estado.');
      }
    });
  }

  deactivatePromotion(promo: any): void {
    // Llama a un endpoint que simplemente haga UPDATE promotions SET isActive = false WHERE code = ...
    this.promoService.deactivate(promo.code).subscribe(() => {
      this.loadAllPromotions();
    });
  }

  get isAnyPromotionActive(): boolean {
    return this.allPromotions.some(promo => promo.isActive === true);
  }


}
