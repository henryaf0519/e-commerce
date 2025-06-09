import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { InventoryServiceService, InventoryItem } from 'src/app/services/inventory-service.service';
import {generateDate} from 'src/app/utils/utils';

export function maxFileSizeValidator(maxMb: number): ValidatorFn {
  const max = maxMb * 1024 * 1024;
  return (control: AbstractControl) => {
    const files = control.value as FileList | string[];
    if (files && (files as FileList).item) {
      const fileList = files as FileList;
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList.item(i);
        if (f && f.size > max) {
          return { maxFileSize: true };
        }
      }
    }
    return null;
  };
}

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
      size: this.fb.array([this.fb.control('')]),
      color: this.fb.array([this.fb.control('')]),
      quantity: [0, [Validators.required, Validators.min(0)]],
      images: [null, [Validators.required, maxFileSizeValidator(2)]],
      isNew: [false, Validators.required]
    });
  }

   ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      const found = this.inventoryService.getItemById(this.itemId);
      if (found) {
        this.form.patchValue({
          name: found.name,
          description: (found as any).description,
          price: found.price,
          quantity: found.quantity,
          isNew: (found as any).isNew
        });
        if ((found as any).size) {
          const sizeArray = this.form.get('size') as FormArray;
          sizeArray.clear();
          (found as any).size.forEach((s: string) => sizeArray.push(this.fb.control(s)));
        }
        if ((found as any).color) {
          const colorArray = this.form.get('color') as FormArray;
          colorArray.clear();
          (found as any).color.forEach((c: string) => colorArray.push(this.fb.control(c)));
        }
        this.isEdit = true;
      }
    }
  }

  get sizeControls(): FormArray {
    return this.form.get('size') as FormArray;
  }

  get colorControls(): FormArray {
    return this.form.get('color') as FormArray;
  }

  addSize(): void {
    this.sizeControls.push(this.fb.control(''));
  }

  removeSize(index: number): void {
    this.sizeControls.removeAt(index);
  }

  addColor(): void {
    this.colorControls.push(this.fb.control(''));
  }

  removeColor(index: number): void {
    this.colorControls.removeAt(index);
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject();
        reader.readAsDataURL(file);
      });

      Promise.all(Array.from(files).map(f => toBase64(f))).then(base64Files => {
        this.form.get('images')?.setValue(base64Files);
        this.form.get('images')?.updateValueAndValidity();
      });
    } else {
      this.form.get('images')?.setValue(null);
    }
  }

save() {
   console.log('Form submitted:', this.form.value);
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
