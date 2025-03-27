import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildScreenPlaylistComponent } from './child-screen-playlist.component';

describe('ChildScreenPlaylistComponent', () => {
  let component: ChildScreenPlaylistComponent;
  let fixture: ComponentFixture<ChildScreenPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildScreenPlaylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildScreenPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
