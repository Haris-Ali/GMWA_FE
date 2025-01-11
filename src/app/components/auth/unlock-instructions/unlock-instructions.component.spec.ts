import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockInstructionsComponent } from './unlock-instructions.component';

describe('UnlockInstructionsComponent', () => {
  let component: UnlockInstructionsComponent;
  let fixture: ComponentFixture<UnlockInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockInstructionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
