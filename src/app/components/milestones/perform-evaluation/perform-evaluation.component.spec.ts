import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformEvaluationComponent } from './perform-evaluation.component';

describe('PerformEvaluationComponent', () => {
  let component: PerformEvaluationComponent;
  let fixture: ComponentFixture<PerformEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformEvaluationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
