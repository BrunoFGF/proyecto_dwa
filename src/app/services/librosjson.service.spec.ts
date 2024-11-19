import { TestBed } from '@angular/core/testing';

import { LibrosjsonService } from './librosjson.service';

describe('LibrosjsonService', () => {
  let service: LibrosjsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibrosjsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
