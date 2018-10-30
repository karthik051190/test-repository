import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityRequestsComponent } from './city-requests.component';

describe('CityRequestsComponent', () => {
  let component: CityRequestsComponent;
  let fixture: ComponentFixture<CityRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CityRequestsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
