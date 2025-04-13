import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService } from '../../../../services/video.service';
import { YoutubeService } from '../../../../services/youtube.service';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí

@Component({
  selector: 'app-create-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule ],
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.css']
})
export class CreateVideoComponent implements OnInit {
  videoForm: FormGroup;
  thumbnailUrl: string | null = null; // Variable to store the thumbnail URL
  isMenuOpen: boolean = false; // Track menu state
  searchQuery: string = '';
  youtubeVideos: any[] = [];
  filteredVideos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private youtubeService: YoutubeService,
    private router: Router
  ) {
    this.videoForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadPopularVideos();

  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
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
  loadPopularVideos() {
    this.youtubeService.getPopularVideos().subscribe({
      next: (videos) => {
        this.youtubeVideos = videos;
        this.filteredVideos = videos; // Inicialmente muestra todos los videos
      },
      error: (err) => {
        console.error('Error loading popular videos:', err);
      }
    });
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
  
  
  // Autocompletar el formulario con los datos del video seleccionado
  populateForm(video: any) {
    this.videoForm.patchValue({
      name: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      description: video.description
    });
    this.thumbnailUrl = video.thumbnail;
  }

  // Truncar descripciones largas
  truncateDescription(description: string): string {
    const maxLength = 100;
    return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
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