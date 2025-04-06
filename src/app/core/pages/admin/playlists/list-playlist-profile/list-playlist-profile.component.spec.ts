import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlaylistProfileComponent } from './list-playlist-profile.component';

describe('ListPlaylistProfileComponent', () => {
  let component: ListPlaylistProfileComponent;
  let fixture: ComponentFixture<ListPlaylistProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlaylistProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlaylistProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
