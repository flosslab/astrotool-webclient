import { TestBed } from '@angular/core/testing';

import { CloseWarningService } from './close-warning.service';

describe('CloseWarningService', () => {
  let service: CloseWarningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloseWarningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
