import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptCardComponent } from './concept-card.component';

describe('ConceptCardComponent', () => {
  let component: ConceptCardComponent;
  let fixture: ComponentFixture<ConceptCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConceptCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConceptCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
