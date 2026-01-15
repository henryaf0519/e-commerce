import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SectionsService } from 'src/app/services/sections.service';

@Component({
  selector: 'app-section-manager',
  templateUrl: './section-manager.component.html',
  styleUrls: ['./section-manager.component.scss'],
})
export class SectionManagerComponent {
  sections: any[] = [];

  // Input único para el nombre (Validamos que no esté vacío)
  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  loading = false;

  constructor(private sectionService: SectionsService) {}

  ngOnInit(): void {
    this.loadSections();
  }

  loadSections() {
    this.sectionService.getSections().subscribe({
      next: (data:any) => (this.sections = data),
      error: (err:any) => console.error('Error cargando secciones', err),
    });
  }

  addSection() {
    if (this.nameControl.invalid) return;

    this.loading = true;
    const name = this.nameControl.value!;

    // Llamamos al servicio pasando solo el string, él arma el objeto JSON
    this.sectionService.createSection(name).subscribe({
      next: () => {
        this.nameControl.reset(); // Limpiar input
        this.loadSections(); // Recargar tabla
        this.loading = false;
      },
      error: (err:any) => {
        console.error('Error creando sección', err);
        this.loading = false;
      },
    });
  }
}
