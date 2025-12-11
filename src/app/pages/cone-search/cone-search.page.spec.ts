import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConeSearchPage } from './cone-search.page';

describe('ConeSearchPage', () => {
  let component: ConeSearchPage;
  let fixture: ComponentFixture<ConeSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConeSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
