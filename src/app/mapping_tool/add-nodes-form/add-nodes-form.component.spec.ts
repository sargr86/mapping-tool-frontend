import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNodesFormComponent } from './add-nodes-form.component';

describe('AddNodesFormComponent', () => {
  let component: AddNodesFormComponent;
  let fixture: ComponentFixture<AddNodesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNodesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNodesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
