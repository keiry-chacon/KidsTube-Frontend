import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-update-playlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-playlist.component.html',
  styleUrls: ['./update-playlist.component.css']
})
export class UpdatePlaylistComponent implements OnInit {
  playlistForm: FormGroup;
  profiles: any[] = [];
  videos: any[] = [];
  playlistId: string = '';
  currentPlaylist: any = null;
  isMenuOpen: boolean = false; // Track menu state

  // Arrays to store selected profile and video IDs
  selectedProfiles: string[] = [];
  selectedVideos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private router: Router
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

    this.playlistId = this.route.snapshot.paramMap.get('id') || '';
    if (this.playlistId) {
      this.loadPlaylist();
    }
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
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
      next: (data) => this.videos = data,
    });
  }

  // Loads the current playlist data by its ID
  loadPlaylist() {
    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (playlist) => {
        this.currentPlaylist = playlist;

        this.playlistForm.patchValue({
          name: playlist.name,
          associatedProfiles: playlist.associatedProfiles,
          videos: playlist.videos.map((video: any) => video._id)
        });

        this.selectedProfiles = playlist.associatedProfiles || [];
        this.selectedVideos = playlist.videos.map((video: any) => video._id);
      },
      error: (err) => {
        alert('Failed to load playlist. Check the console for details.');
      }
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

  // Handles form submission to update the playlist
  onSubmit() {
    if (this.playlistForm.valid) {
      const formData = this.playlistForm.value;

      this.playlistService.updatePlaylist(this.playlistId, formData).subscribe({
        next: () => {
          alert('Playlist updated successfully!');
          this.router.navigate(['/playlists']); // Redirect to the playlist list
        },
        error: (err) => {
          alert('Failed to update playlist. Check the console for details.');
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }

  // Cancels the update and navigates back to the playlist list
  cancel() {
    this.router.navigate(['/playlists']);
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