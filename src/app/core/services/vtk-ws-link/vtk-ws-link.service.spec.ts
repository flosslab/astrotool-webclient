import { TestBed } from '@angular/core/testing';

import { VtkWsLinkService } from './vtk-ws-link.service';

describe('VtkWsLinkService', () => {
  let service: VtkWsLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VtkWsLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
