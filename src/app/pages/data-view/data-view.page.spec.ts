import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataViewPage } from './data-view.page';

describe('DataViewPage', () => {
  let component: DataViewPage;
  let fixture: ComponentFixture<DataViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
