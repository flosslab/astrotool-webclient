import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hips2fitsPage } from './hips2fits.page';

describe('Hips2fitsPage', () => {
  let component: Hips2fitsPage;
  let fixture: ComponentFixture<Hips2fitsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Hips2fitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
