import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsCalendarComponent } from './slots-calendar.component';

describe('SlotsCalendarComponent', () => {
  let component: SlotsCalendarComponent;
  let fixture: ComponentFixture<SlotsCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlotsCalendarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
