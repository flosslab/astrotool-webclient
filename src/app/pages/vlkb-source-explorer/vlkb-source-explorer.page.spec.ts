import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VlkbSourceExplorerPage } from './vlkb-source-explorer.page';

describe('VlkbTestPagePage', () => {
  let component: VlkbSourceExplorerPage;
  let fixture: ComponentFixture<VlkbSourceExplorerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VlkbSourceExplorerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
