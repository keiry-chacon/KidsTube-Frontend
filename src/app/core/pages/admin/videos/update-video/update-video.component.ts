import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-update-video',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-video.component.html',
  styleUrls: ['./update-video.component.css']
})
export class UpdateVideoComponent implements OnInit {
  videoForm!: FormGroup;
  videoId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.videoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.videoId) {
      this.loadVideo();
    }

    this.initializeForm();
  }

  // Initializes the form with default values and validators
  initializeForm() {
    this.videoForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$')]],
      description: ['']
    });
  }

  // Loads the video data by its ID
  loadVideo() {
    this.videoService.getVideoById(this.videoId).subscribe({
      next: (data) => {
        this.videoForm.patchValue(data);
      },
      error: (err) => {
        alert('Failed to load video. Check the console for details.');
      }
    });
  }

  // Handles form submission to update the video
  updateVideo() {
    if (this.videoForm.valid) {
      this.videoService.updateVideo(this.videoId, this.videoForm.value).subscribe({
        next: () => {
          alert('Video updated successfully!');
          this.router.navigate(['/videoList']);
        },
        error: (err) => {
          alert('Failed to update video. Check the console for details.');
        }
      });
    }
  }

  // Cancels the update and navigates back to the video list
  cancel() {
    this.router.navigate(['/videoList']);
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