import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QChartsComponent } from './q-charts.component';

describe('QChartsComponent', () => {
  let component: QChartsComponent;
  let fixture: ComponentFixture<QChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
