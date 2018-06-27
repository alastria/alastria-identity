import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPublicKeyComponent } from './get-public-key.component';

describe('GetPublicKeyComponent', () => {
  let component: GetPublicKeyComponent;
  let fixture: ComponentFixture<GetPublicKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetPublicKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPublicKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
