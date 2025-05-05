import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../../services/video.service';
import { YoutubeService } from '../../../../services/youtube.service';
import { FormsModule } from '@angular/forms';
interface YouTubeApiResponse {
  items: YouTubeVideo[];
}

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
    };
  };
}
@Component({
  selector: 'app-update-video',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './update-video.component.html',
  styleUrls: ['./update-video.component.css']
})

export class UpdateVideoComponent implements OnInit {
  videoForm!: FormGroup;
  videoId: string = '';
  isMenuOpen: boolean = false; // Track menu state
  youtubeVideos: any[] = [];
  filteredVideos: any[] = [];
  searchQuery: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService,
    private fb: FormBuilder,
    private youtubeService: YoutubeService,

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
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
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
  onDblClickSelect(video: any) {
    this.selectYouTubeVideo(video);
    this.searchQuery = '';
    this.filteredVideos = [];
  }
  filterVideos() {
    if (!this.searchQuery) {
      this.filteredVideos = this.youtubeVideos; // Mostrar todos si no hay búsqueda
      return;
    }
    this.filteredVideos = this.youtubeVideos.filter((video) =>
      video.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  truncateDescription(description: string): string {
    const maxLength = 100;
    return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
  }
  onSearchChange(query: string) {
    if (!query) {
      this.filteredVideos = this.youtubeVideos;
      return;
    }
  
    this.youtubeService.searchYouTubeVideos(query).subscribe({
      next: (results) => {
        this.filteredVideos = results;
      },
      error: (err) => {
        console.error('Error fetching YouTube search results:', err);
      }
    });
  }

  selectYouTubeVideo(video: any) {
    console.log('Video seleccionado:', video);
  
    const title = video.title || 'Sin título';
    const description = video.description || '';
    const url = `https://www.youtube.com/watch?v=${video.id}`;
  
    this.videoForm.patchValue({
      name: title,
      url: url,
      description: description
    });
  
    this.searchQuery = '';
    this.filteredVideos = [];
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