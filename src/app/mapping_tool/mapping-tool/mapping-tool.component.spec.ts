import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingToolComponent } from './mapping-tool.component';

describe('MappingToolComponent', () => {
  let component: MappingToolComponent;
  let fixture: ComponentFixture<MappingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
