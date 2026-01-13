import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  previews: string[] = [];
  existingImages: string[] = []; 
  
  readonly MAX_IMAGES = 4;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    // ELIMINADOS: sizeInput y colorInput
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [1, [Validators.required, Validators.min(0)]],
      show: [true],
      isNew: [true]
    });
  }

  checkEditMode(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEditMode = true;
        const stateProduct = history.state.productData;
        if (stateProduct && stateProduct.id === this.productId) {
          this.populateForm(stateProduct);
        } else {
          this.loadProductData(this.productId);
        }
      }
    });
  }

  loadProductData(id: string): void {
    this.loading = true;
    this.inventoryService.getProductById(id).subscribe({
      next: (product) => {
        this.loading = false;
        this.populateForm(product);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error cargando el producto.';
      }
    });
  }

  private populateForm(product: any): void {
    // ELIMINADOS: Mapeo de size y color
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.quantity, 
      show: product.isVisible !== undefined ? product.isVisible : true,
      isNew: product.isNew || false
    });

    if (product.images && product.images.length > 0) {
      this.existingImages = [...product.images]; 
    }
  }

  onFileSelect(event: any): void {
    const input = event.target;
    const files = input.files;
    
    // Limpiamos errores previos
    this.errorMessage = ''; 

    if (files && files.length > 0) {
      const filesArray = Array.from(files) as File[];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
      const maxBytes = 1024 * 1024; // 1MB

      const validFiles: File[] = [];

      // 1. Validamos archivo por archivo
      for (const file of filesArray) {
        
        // Validación de Tipo
        if (!allowedTypes.includes(file.type)) {
          this.errorMessage = `El formato de "${file.name}" no es válido. Solo JPG, PNG, WEBP.`;
          // Detenemos el proceso para mostrar el error inmediatamente
          input.value = ''; 
          return; 
        }

        // Validación de Tamaño
        if (file.size > maxBytes) {
          this.errorMessage = `La imagen "${file.name}" es muy pesada (Max 1MB).`;
          // Detenemos el proceso para mostrar el error inmediatamente
          input.value = '';
          return;
        }

        validFiles.push(file);
      }

      // 2. Validamos Espacio Disponible (Cupos)
      const currentTotal = this.selectedFiles.length + this.existingImages.length;
      const remainingSlots = this.MAX_IMAGES - currentTotal;

      if (remainingSlots <= 0) {
        this.errorMessage = 'Has alcanzado el límite máximo de 4 imágenes.';
        input.value = '';
        return;
      }

      // 3. Agregamos solo los que caben
      const filesToAdd = validFiles.slice(0, remainingSlots);
      
      this.selectedFiles = [...this.selectedFiles, ...filesToAdd];
      
      // Generamos previews
      filesToAdd.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => this.previews.push(e.target.result);
        reader.readAsDataURL(file);
      });

      // Aviso si intentó subir más de los que cabían
      if (validFiles.length > remainingSlots) {
        this.errorMessage = 'Solo se agregaron imágenes hasta completar el cupo de 4.';
      }
    }
    
    // Reset del input para permitir subir el mismo archivo si se equivocó y corrigió
    input.value = ''; 
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
    this.errorMessage = ''; 
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const totalImages = this.selectedFiles.length + this.existingImages.length;
    if (totalImages === 0) {
      this.errorMessage = 'Debes tener al menos una imagen del producto.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    const formValue = this.productForm.value;

    // Solo enviamos los datos esenciales
    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('price', formValue.price);
    formData.append('stock', formValue.stock);
    formData.append('show', formValue.show);
    formData.append('isNew', formValue.isNew);
    
    // ELIMINADOS: size y color del append

    this.existingImages.forEach(url => {
      formData.append('existingImages', url);
    });

    this.selectedFiles.forEach(file => {
      formData.append('files', file); 
    });

    const request$ = (this.isEditMode && this.productId) 
      ? this.inventoryService.updateProduct(this.productId, formData)
      : this.inventoryService.createProduct(formData);

    request$.subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = this.isEditMode ? '¡Producto actualizado!' : '¡Producto creado!';
        setTimeout(() => {
          this.router.navigate(['/admin/inventory']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Ocurrió un error al guardar el producto.';
      }
    });
  }
}