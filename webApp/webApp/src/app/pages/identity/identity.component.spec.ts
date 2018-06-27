import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyComponent1Component } from './my-component1.component';

describe('MyComponent1Component', () => {
  let component: MyComponent1Component;
  let fixture: ComponentFixture<MyComponent1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyComponent1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComponent1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
