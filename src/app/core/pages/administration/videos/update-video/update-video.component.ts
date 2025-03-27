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

  initializeForm() {
    this.videoForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$')]],
      description: ['']
    });
  }

  loadVideo() {
    this.videoService.getVideoById(this.videoId).subscribe({
      next: (data) => {
        this.videoForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error loading video:', err);
        alert('Failed to load video. Check the console for details.');
      }
    });
  }

  updateVideo() {
    if (this.videoForm.valid) {
      this.videoService.updateVideo(this.videoId, this.videoForm.value).subscribe({
        next: () => {
          alert('Video updated successfully!');
          this.router.navigate(['/videoList']);
        },
        error: (err) => {
          console.error('Error updating video:', err);
          alert('Failed to update video. Check the console for details.');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/videoList']);
  }

  // Función para obtener la miniatura del video
  getVideoThumbnail(url: string): string {
    const videoId = this.extractVideoIdFromUrl(url); // Extraemos el ID del video
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Miniatura mediana (320x180)
    }
    return '/assets/videos/default-thumbnail.jpg'; // Imagen predeterminada si no hay ID válido
  }

  // Función para extraer el ID del video de YouTube
  extractVideoIdFromUrl(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }



  navigateToVideoList(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/videoList']);
  }

  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/listPlaylist']);
  }

  logout(event: Event): void {
    event.preventDefault();
    sessionStorage.clear();
    this.router.navigate(['/login']); 
  }
}