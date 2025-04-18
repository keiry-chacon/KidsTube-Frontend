import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlaylistComponent } from './update-playlist.component';

describe('UpdatePlaylistComponent', () => {
  let component: UpdatePlaylistComponent;
  let fixture: ComponentFixture<UpdatePlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePlaylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
