import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';

@Component({
  selector: 'app-list-playlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-playlist.component.html',
  styleUrls: ['./list-playlist.component.css']
})
export class ListPlaylistComponent implements OnInit {
  playlists: any[] = [];
  loading: boolean = true;
  error: string = '';
  isMenuOpen: boolean = false; // Track menu state


  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlaylists();
  }

  // Loads all playlists
  loadPlaylists() {
    this.playlistService.getUserPlaylists().subscribe({
      next: (data) => {
        this.playlists = data.data.playlistsByUser;        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load playlists. Check the console for details.';
        this.loading = false;
      }
    });
  }

  // Navigates to the create playlist page
  createNewPlaylist() {
    this.router.navigate(['/createPlaylist']);
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  // Navigates to the update playlist page for a specific playlist
  editPlaylist(id: string) {
    this.router.navigate(['/updatePlaylist', id]);
  }

  // Navigates to the detail page of a specific playlist
  viewDetails(id: string) {
    this.router.navigate(['/detailPlaylist', id]);
  }

  // Deletes a playlist after confirmation
  deletePlaylist(id: string) {
    if (confirm('Are you sure you want to delete this playlist?')) {
      this.playlistService.deletePlaylist(id).subscribe({
        next: () => {
          alert('Playlist deleted successfully!');
          this.loadPlaylists(); // Reload the list after deletion
        },
        error: (err) => {
          alert('Failed to delete playlist. Check the console for details.');
        }
      });
    }
  }

  // Returns the thumbnail URL of the first video in the playlist
  getPlaylistThumbnail(videos: any[]): string {
    if (videos && videos.length > 0) {
      const firstVideoUrl = videos[0].url;
      const videoId = this.extractVideoIdFromUrl(firstVideoUrl);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }
    return '/assets/videos/default-thumbnail.jpg'; // Default image if no videos exist
  }

  // Extracts the YouTube video ID from a URL
  extractVideoIdFromUrl(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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