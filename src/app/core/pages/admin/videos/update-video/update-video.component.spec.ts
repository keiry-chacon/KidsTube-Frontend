import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVideoComponent } from './update-video.component';

describe('UpdateVideoComponent', () => {
  let component: UpdateVideoComponent;
  let fixture: ComponentFixture<UpdateVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
