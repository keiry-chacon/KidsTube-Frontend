import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';

import { HamburgerMenuComponent } from '../../../../../components/hamburger-menu/hamburger-menu.component'; // Import the component

interface Video {
  url?: string;
  thumbnail?: string;
  name: string;
  // Other properties that may exist...
}

// Define the interface for playlists
interface Playlist {
  _id: string;
  name: string;
  thumbnail?: string;
  videos: Video[];
  associatedProfiles: any[]; // You can define a more specific interface if needed
}

@Component({
  selector: 'app-list-playlist-profile',
  imports: [CommonModule, ReactiveFormsModule, HamburgerMenuComponent],
  templateUrl: './list-playlist-profile.component.html',
  styleUrl: './list-playlist-profile.component.css'
})
export class ListPlaylistProfileComponent {

  playlists: Playlist[] = []; // Use the Playlist interface
  loading: boolean = true;
  error: string = '';
  profileId: string | null = null;

  constructor(
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileId = this.profileService.getProfileId();
    this.loadPlaylists();
  }

  // Loads playlists associated with the current profile
  loadPlaylists(): void {
    if (!this.profileId) {
      this.router.navigate(['/profiles']);
      return;
    }

    this.playlistService.getPlaylistsByProfileId(this.profileId).subscribe({
      next: (response: any) => {
        const data = response.data.playlistsByProfile; // Extraer datos del backend
        this.playlists = data.map((playlist: any) => ({
          ...playlist,
          thumbnail: this.getFirstVideoThumbnail(playlist) || 'assets/images/default-thumbnail.jpg',
        }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading playlists:', err);
        this.error = 'Failed to load playlists.';
        this.loading = false;
      },
    });
  }

  // Retrieves the thumbnail of the first video in the playlist
  getFirstVideoThumbnail(playlist: any): string | null {
    if (!playlist.videos || playlist.videos.length === 0) return null;

    const firstVideo = playlist.videos[0];
    if (firstVideo.url) {
      return this.getYoutubeThumbnail(firstVideo.url);
    }
    return firstVideo.thumbnail || null;
  }

  // Generates a YouTube thumbnail URL from a video URL
  getYoutubeThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  // Extracts the YouTube video ID from a URL
  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  // Handles image loading errors by setting a default image
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.warn('Error loading image:', imgElement.src);
    imgElement.src = 'assets/images/default-thumbnail.jpg';
    imgElement.alt = 'Default image';
  }

  // Navigates to the playlist detail page
  navigateToPlaylist(playlistId: string): void {
    if (!playlistId) {
      return;
    }

    this.router.navigate(['/child-screen-playlist', playlistId]).then(nav => {
      console.log('Navigation success:', nav);
    }, err => {
    });
  }
}