import { TestBed } from '@angular/core/testing';

import { ProgrammingQuestionsService } from './programming-questions.service';

describe('ProgrammingQuestionsService', () => {
  let service: ProgrammingQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgrammingQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
