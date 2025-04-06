import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  selectedProfiles: string[] = []; // Array to store selected profile IDs
  selectedVideos: string[] = [];   // Array to store selected video IDs

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private videoService: VideoService,
    private router: Router
  ) {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
      associatedProfiles: [[], Validators.required], // Empty array initially
      videos: [[], Validators.required]              // Empty array initially
    });
  }

  ngOnInit() {
    this.loadProfiles();
    this.loadVideos();
  }

  // Loads all available profiles
  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (response) => {
        this.profiles = response.data || response;
      },
      error: (err) => {
        alert('Failed to load profiles. Check the console for details.');
      }
    });
  }

  // Loads all available videos
  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        console.log('Videos loaded:', data); // Inspect data in the console
        this.videos = data;
      },
    });
  }

  // Toggles the selection of a profile
  toggleProfileSelection(profileId: string): void {
    const index = this.selectedProfiles.indexOf(profileId);
    if (index === -1) {
      this.selectedProfiles.push(profileId);
    } else {
      this.selectedProfiles.splice(index, 1);
    }
    this.playlistForm.patchValue({ associatedProfiles: this.selectedProfiles });
  }

  // Checks if a profile is selected
  isSelected(profileId: string): boolean {
    return this.selectedProfiles.includes(profileId);
  }

  // Toggles the selection of a video
  toggleVideoSelection(videoId: string): void {
    const index = this.selectedVideos.indexOf(videoId);
    if (index === -1) {
      this.selectedVideos.push(videoId);
    } else {
      this.selectedVideos.splice(index, 1);
    }
    this.playlistForm.patchValue({ videos: this.selectedVideos });
  }

  // Checks if a video is selected
  isVideoSelected(videoId: string): boolean {
    return this.selectedVideos.includes(videoId);
  }

  // Returns the URL of the avatar image
  getAvatarUrl(avatarFileName: string): string {
    if (!avatarFileName) {
      return '/assets/profiles/default-avatar.jpg'; // Default image if no avatar exists
    }
    return `/assets/profiles/${avatarFileName}`;
  }

  // Returns the YouTube thumbnail URL for a given video URL
  getYoutubeThumbnail(youtubeUrl: string): string {
    const videoId = this.extractVideoIdFromUrl(youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Medium-sized thumbnail (320x180)
    }
    return '/assets/videos/default-thumbnail.jpg'; // Default image if video ID cannot be extracted
  }

  // Extracts the video ID from a YouTube URL
  extractVideoIdFromUrl(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Handles form submission to create a new playlist
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

  // Navigates to the video list page
  navigateToVideoList(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/videoList']);
  }

  // Navigates to the playlist list page
  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/listPlaylist']);
  }

  // Logs out the user and clears session storage
  logout(event: Event): void {
    event.preventDefault();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}