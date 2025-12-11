import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Select3dPage } from './select3d.page';

describe('Select3dPage', () => {
  let component: Select3dPage;
  let fixture: ComponentFixture<Select3dPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Select3dPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
