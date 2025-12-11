import { TestBed } from '@angular/core/testing';

import { VtkSessionService } from './vtk-session.service';

describe('VtkSessionService', () => {
  let service: VtkSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VtkSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
