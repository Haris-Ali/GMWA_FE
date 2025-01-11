import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationInstructionsComponent } from './confirmation-instructions.component';

describe('ConfirmationInstructionsComponent', () => {
  let component: ConfirmationInstructionsComponent;
  let fixture: ComponentFixture<ConfirmationInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationInstructionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
