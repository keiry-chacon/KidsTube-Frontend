import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoService } from '../../../../services/video.service';
import { Router } from '@angular/router';
import { YoutubeService } from '../../../../services/youtube.service';
import { PlaylistService } from '../../../../services/playlist.service';

 interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css'],
})
export class VideoListComponent implements OnInit {
  videos: any[] = [];
  expandedDescriptions: boolean[] = [];
  isMenuOpen: boolean = false; // Track menu state
  playlists: any[] = [];
  constructor(
    private videoService: VideoService,
    private youtubeService: YoutubeService,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlaylistVideos();
  }

  loadPlaylistVideos() {
    this.videoService.getVideosByUser().subscribe({
      next: (data: any) => {
        this.videos = data; // Guarda los videos en el componente
        this.expandedDescriptions = Array(this.videos.length).fill(false); // Inicializa estados expandidos
      },
      error: (err: unknown) => {
        console.error('Error loading playlist videos:', err);
      },
    });
  }

  goBackToProfiles() {
    this.router.navigate(['/profiles']); 
    }
  truncateDescription(description: string): string {
    const maxLength = 50;
    return description && description.length > maxLength
      ? `${description.slice(0, maxLength)}...`
      : description;
  }

  // Toggle expanded state for a specific video
  toggleDescription(index: number): void {
    this.expandedDescriptions[index] = !this.expandedDescriptions[index];
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }



  // Navigates to the edit page for a specific video
  editVideo(id: string) {
    this.router.navigate(['/updateVideo', id]);
  }

  // Navigates to the detail page of a specific video
  viewDetails(id: string) {
    this.router.navigate(['/detailVideo', id]);
  }

  // Deletes a video after confirmation
  deleteVideo(id: string) {
    if (confirm('Are you sure you want to delete this video?')) {
      this.videoService.deleteVideo(id).subscribe({
        next: () => {
          alert('Video deleted successfully!');
          this. loadPlaylistVideos(); 
        },
        error: (err) => {
          alert('Failed to delete video. Check the console for details.');
        }
      });
    }
  }

  // Navigates to the create video page
  createNewVideo() {
    this.router.navigate(['/createVideo']);
  }
  addToPlaylist(video: any): void {
    console.log(`Agregando "${video.name}" a la playlist...`);
  }
  
  // Generates the YouTube thumbnail URL from a video URL
  getVideoThumbnail(url: string): string {
    const videoId = this.extractVideoIdFromUrl(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Medium-sized thumbnail (320x180)
    }
    return '/assets/videos/default-thumbnail.jpg'; // Default image if no valid ID is found
  }

  // Extracts the video ID from a YouTube URL
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