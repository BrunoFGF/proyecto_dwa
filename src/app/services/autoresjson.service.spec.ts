import { TestBed } from '@angular/core/testing';

import { AutoresjsonService } from './autoresjson.service';

describe('AutoresjsonService', () => {
  let service: AutoresjsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoresjsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
