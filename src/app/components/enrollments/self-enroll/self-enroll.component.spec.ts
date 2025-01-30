import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEnrollComponent } from './self-enroll.component';

describe('SelfEnrollComponent', () => {
  let component: SelfEnrollComponent;
  let fixture: ComponentFixture<SelfEnrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEnrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
