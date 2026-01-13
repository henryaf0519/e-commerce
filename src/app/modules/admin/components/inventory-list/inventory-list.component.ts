import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { InventoryService } from 'src/app/services/inventory-service.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  // Flujo de datos reactivo para recargar la tabla sin F5
  private refresh$ = new BehaviorSubject<boolean>(true);
  products$!: Observable<any[]>;

  // Estado del Modal de Eliminación
  isDeleteModalOpen = false;
  productToDelete: any | null = null;
  isDeleting = false;

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.products$ = this.refresh$.pipe(
      switchMap(() => this.inventoryService.getAdminProducts())
    );
  }

  create() {
    this.router.navigate(['admin/inventory/create']); // Ajusta la ruta según tu routing
  }

  edit(product: any) {
    this.router.navigate(['admin/inventory/edit', product.id], {
      state: { productData: product },
    });
  }

  // --- LÓGICA DEL MODAL ---

  openDeleteModal(product: any) {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (!this.productToDelete) return;

    this.isDeleting = true;
    this.inventoryService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        // Éxito: Cerramos modal, recargamos lista
        this.isDeleting = false;
        this.closeDeleteModal();
        this.refresh$.next(true);
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.isDeleting = false;
        alert('Failed to delete product.'); // Feedback simple de error
      },
    });
  }
}
