import { TestBed } from '@angular/core/testing';

import { ReseniajsonService } from './reseniajson.service';

describe('ReseniajsonService', () => {
  let service: ReseniajsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReseniajsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
