import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildScreenComponent } from './child-screen.component';

describe('ChildScreenComponent', () => {
  let component: ChildScreenComponent;
  let fixture: ComponentFixture<ChildScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
