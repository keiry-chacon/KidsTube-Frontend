import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-create-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.css']
})
export class CreateVideoComponent implements OnInit {
  videoForm: FormGroup;
  thumbnailUrl: string | null = null; // Variable to store the thumbnail URL

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private router: Router
  ) {
    this.videoForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    // Listen for changes in the URL field
    this.videoForm.get('url')?.valueChanges.subscribe((url) => {
      if (url) {
        this.thumbnailUrl = this.getYoutubeThumbnail(url); // Update the thumbnail
      } else {
        this.thumbnailUrl = null; // Clear the thumbnail if no URL is provided
      }
    });
  }

  // Handles form submission to create a new video
  onSubmit() {
    if (this.videoForm.valid) {
      const formData = this.videoForm.value;
      console.log('Sending data:', formData);

      this.videoService.createVideo(formData).subscribe({
        next: (response) => {
          alert('Video created successfully!');
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Error creating video. Try again later.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }

  // Generates the YouTube thumbnail URL from a video URL
  getYoutubeThumbnail(youtubeUrl: string): string | null {
    const videoId = this.extractVideoIdFromUrl(youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Medium-sized thumbnail (320x180)
    }
    return '/assets/videos/default-thumbnail.jpg'; // Default image
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