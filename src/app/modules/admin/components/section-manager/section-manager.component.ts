import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SectionsService } from 'src/app/services/sections.service';

@Component({
  selector: 'app-section-manager',
  templateUrl: './section-manager.component.html',
  styleUrls: ['./section-manager.component.scss'],
})
export class SectionManagerComponent implements OnInit {
  sections: any[] = [];
  sectionForm!: FormGroup;
  loading = false;

  // Manejo de imagen
  selectedFile: File | null = null;
  preview: string | null = null;
  errorMessage = '';

  constructor(
    private sectionService: SectionsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSections();
  }

  initForm(): void {
    this.sectionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subtitle: ['', [Validators.required]],
      tagline: ['', [Validators.required]]
    });
  }

  loadSections() {
    this.sectionService.getSections().subscribe({
      next: (data: any) => (this.sections = data),
      error: (err: any) => console.error('Error cargando secciones', err),
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    this.errorMessage = '';
    const pesoMaximoMB = 2.5;
    const limiteBytes = pesoMaximoMB * 1024 * 1024;

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'El formato no es válido. Solo JPG, PNG, WEBP.';
        return;
      }
      if (file.size > limiteBytes) { // 1MB Max
        this.errorMessage = 'La imagen es muy pesada (Max 2.5MB).';
        return;
      }

      this.selectedFile = file;
      
      // Generar vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => this.preview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.preview = null;
    this.errorMessage = '';
  }

  addSection() {
    if (this.sectionForm.invalid || !this.selectedFile) {
      this.sectionForm.markAllAsTouched();
      if (!this.selectedFile) {
        this.errorMessage = 'Debes seleccionar una imagen para la sección.';
      }
      return;
    }

    this.loading = true;
    
    // Usamos FormData para enviar texto e imagen al backend
    const formData = new FormData();
    formData.append('title', this.sectionForm.get('title')?.value);
    formData.append('subtitle', this.sectionForm.get('subtitle')?.value);
    formData.append('tagline', this.sectionForm.get('tagline')?.value);
    formData.append('image', this.selectedFile);

    this.sectionService.createSection(formData).subscribe({
      next: () => {
        this.sectionForm.reset(); // Limpiar inputs
        this.removeFile(); // Limpiar imagen
        this.loadSections(); // Recargar tabla
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error creando sección', err);
        this.errorMessage = 'Ocurrió un error al crear la sección.';
        this.loading = false;
      },
    });
  }
}