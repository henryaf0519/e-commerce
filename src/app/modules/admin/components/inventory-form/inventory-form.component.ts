import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory-service.service';
import { SectionsService } from 'src/app/services/sections.service';

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
  
  // 2. Variable para almacenar las secciones que vienen del backend
  sections: string[] = [];

  selectedFiles: File[] = [];
  previews: string[] = [];
  existingImages: string[] = []; 
  
  readonly MAX_IMAGES = 4;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private sectionService: SectionsService, // 3. Inyectamos el servicio
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSections(); // 4. Cargamos las secciones al iniciar
    this.checkEditMode();
  }

  // Nueva función para obtener las secciones
  loadSections(): void {
    this.sectionService.getSections().subscribe({
      next: (data) => {
        this.sections = data;
      },
      error: (err) => {
        console.error('Error cargando secciones', err);
        // No bloqueamos la app, pero podríamos mostrar un aviso si es crítico
      }
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [1, [Validators.required, Validators.min(0)]],
      // 5. Agregamos el control de sección (Obligatorio)
      section: ['', [Validators.required]], 
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
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.quantity, 
      section: product.section || '', 
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
    this.errorMessage = ''; 

    if (files && files.length > 0) {
      const filesArray = Array.from(files) as File[];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
      const maxBytes = 1024 * 1024; // 1MB
      const validFiles: File[] = [];

      for (const file of filesArray) {
        if (!allowedTypes.includes(file.type)) {
          this.errorMessage = `El formato de "${file.name}" no es válido. Solo JPG, PNG, WEBP.`;
          input.value = ''; 
          return; 
        }
        if (file.size > maxBytes) {
          this.errorMessage = `La imagen "${file.name}" es muy pesada (Max 1MB).`;
          input.value = '';
          return;
        }
        validFiles.push(file);
      }

      const currentTotal = this.selectedFiles.length + this.existingImages.length;
      const remainingSlots = this.MAX_IMAGES - currentTotal;

      if (remainingSlots <= 0) {
        this.errorMessage = 'Has alcanzado el límite máximo de 4 imágenes.';
        input.value = '';
        return;
      }

      const filesToAdd = validFiles.slice(0, remainingSlots);
      this.selectedFiles = [...this.selectedFiles, ...filesToAdd];
      
      filesToAdd.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => this.previews.push(e.target.result);
        reader.readAsDataURL(file);
      });

      if (validFiles.length > remainingSlots) {
        this.errorMessage = 'Solo se agregaron imágenes hasta completar el cupo de 4.';
      }
    }
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

    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('price', formValue.price);
    formData.append('stock', formValue.stock);
    // 7. Agregamos la sección al FormData
    formData.append('section', formValue.section);
    formData.append('show', formValue.show);
    formData.append('isNew', formValue.isNew);
    
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