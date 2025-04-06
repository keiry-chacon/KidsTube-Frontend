import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../../services/video.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  videos: any[] = [];

  constructor(
    private videoService: VideoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  // Loads all videos
  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos = data;
      },
      error: (err) => {
        alert('Failed to load videos. Check the console for details.');
      }
    });
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
          this.loadVideos(); // Reload the list after deletion
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