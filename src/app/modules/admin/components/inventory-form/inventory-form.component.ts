import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryServiceService, InventoryItem } from 'src/app/services/inventory-service.service';
import {generateDate} from 'src/app/utils/utils';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {


  form: FormGroup;
  isEdit = false;
  itemId: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryServiceService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      size: [[], []], // optional array
      color: [[], []], // optional array
      quantity: [0, [Validators.required, Validators.min(0)]],
      images: [[], Validators.required], // array, required
      isNew: [false, Validators.required]
    });
  }

   ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      const found = this.inventoryService.getItemById(this.itemId);
      if (found) {
        this.form.patchValue(found);
        this.isEdit = true;
      }
    }
  }

save() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;
    if (this.isEdit && this.itemId) {
      this.inventoryService.updateItem({ id: this.itemId, ...formValue });
    } else {
      this.inventoryService.addItem({ id: generateDate(), ...formValue });
    }
    this.router.navigate(['admin']);
  }
}
