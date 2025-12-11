import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VlkbTestPagePage } from './vlkb-test-page.page';

describe('VlkbTestPagePage', () => {
  let component: VlkbTestPagePage;
  let fixture: ComponentFixture<VlkbTestPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VlkbTestPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
