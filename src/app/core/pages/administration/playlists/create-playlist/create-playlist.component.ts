import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-create-playlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {
  playlistForm: FormGroup;
  profiles: any[] = [];
  videos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private videoService: VideoService
  ) {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
      associatedProfiles: [[], Validators.required],
      videos: [[]]
    });
  }

  ngOnInit() {
    this.loadProfiles();
    this.loadVideos();
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (response) => {
        this.profiles = response.data || response;
      },
      error: (err) => {
        console.error('Error loading profiles:', err);
        alert('Failed to load profiles. Check the console for details.');
      }
    });
  }
  

  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => this.videos = data,
      error: (err) => console.error('Error loading videos:', err)
    });
  }

  onSubmit() {
    if (this.playlistForm.valid) {
      const formData = this.playlistForm.value;
      console.log('Sending data:', formData);

      this.playlistService.createPlaylist(formData).subscribe({
        next: (response) => {
          alert('Playlist created successfully!');
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Error creating playlist. Try again later.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }
}
