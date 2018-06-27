import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawTransactionComponent } from './raw-transaction.component';

describe('RawTransactionComponent', () => {
  let component: RawTransactionComponent;
  let fixture: ComponentFixture<RawTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
