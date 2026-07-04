import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionManagerComponentComponent } from './promotion-manager-component.component';

describe('PromotionManagerComponentComponent', () => {
  let component: PromotionManagerComponentComponent;
  let fixture: ComponentFixture<PromotionManagerComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionManagerComponentComponent]
    });
    fixture = TestBed.createComponent(PromotionManagerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
