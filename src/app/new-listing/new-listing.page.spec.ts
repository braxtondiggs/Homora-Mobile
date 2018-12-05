import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewListingPage } from './new-listing.page';

describe('NewListingPage', () => {
  let component: NewListingPage;
  let fixture: ComponentFixture<NewListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
