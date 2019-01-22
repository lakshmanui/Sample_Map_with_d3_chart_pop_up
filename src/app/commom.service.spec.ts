import { TestBed } from '@angular/core/testing';

import { CommomService } from './commom.service';

describe('CommomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommomService = TestBed.get(CommomService);
    expect(service).toBeTruthy();
  });
});
