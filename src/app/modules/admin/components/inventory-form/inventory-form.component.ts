import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory-service.service';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  
  selectedFiles: File[] = [];
  readonly MAX_IMAGES = 4; // Constante para el límite

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [1, [Validators.required, Validators.min(0)]],
      show: [true],
      isNew: [true],
      sizeInput: ['S,M,L,XL'], 
      colorInput: ['Negro,Blanco,Azul']
    });
  }

 onFileSelect(event: any): void {
  const files = event.target.files;
  this.errorMessage = ''; 

  if (files && files.length > 0) {
    const filesArray = Array.from(files) as File[];
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    
    const validFiles = filesArray.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = `El formato del archivo "${file.name}" no es permitido. Usa JPG, PNG, WEBP o AVIF.`;
        return false;
      }

      if (file.size > 1024 * 1024) {
        this.errorMessage = `El archivo "${file.name}" supera el límite de 1MB.`;
        return false;
      }

      return true;
    });

    const currentCount = this.selectedFiles.length;
    const remainingSlots = 4 - currentCount;

    if (remainingSlots <= 0) {
      this.errorMessage = 'Ya has alcanzado el límite máximo de 4 imágenes.';
    } else {
      const filesToAdd = validFiles.slice(0, remainingSlots);
      this.selectedFiles = [...this.selectedFiles, ...filesToAdd];
      
      if (validFiles.length > remainingSlots) {
        this.errorMessage = 'Solo se agregaron las primeras imágenes hasta completar el límite de 4.';
      }
    }
  }

  event.target.value = '';
}

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.errorMessage = ''; 
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Debes subir al menos una imagen del producto.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formData = new FormData();
    const formValue = this.productForm.value;

    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('price', formValue.price);
    formData.append('stock', formValue.stock);
    formData.append('show', formValue.show);
    formData.append('isNew', formValue.isNew);
    formData.append('size', formValue.sizeInput); 
    formData.append('color', formValue.colorInput);

    this.selectedFiles.forEach(file => {
      formData.append('files', file); 
    });

    this.inventoryService.createProduct(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = '¡Producto creado con éxito!';
        setTimeout(() => {
          this.router.navigate(['/admin/inventory']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Ocurrió un error al subir el producto.';
      }
    });
  }
}