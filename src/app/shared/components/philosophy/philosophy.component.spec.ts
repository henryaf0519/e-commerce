import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhilosophyComponent } from './philosophy.component';

describe('PhilosophyComponent', () => {
  let component: PhilosophyComponent;
  let fixture: ComponentFixture<PhilosophyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhilosophyComponent]
    });
    fixture = TestBed.createComponent(PhilosophyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
