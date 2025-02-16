import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentResultsComponent } from './assignment-results.component';

describe('AssignmentResultsComponent', () => {
  let component: AssignmentResultsComponent;
  let fixture: ComponentFixture<AssignmentResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
