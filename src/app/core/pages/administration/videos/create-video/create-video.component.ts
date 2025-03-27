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
  thumbnailUrl: string | null = null; // Variable para almacenar la URL de la miniatura

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
    // Escuchar cambios en el campo de URL
    this.videoForm.get('url')?.valueChanges.subscribe((url) => {
      if (url) {
        this.thumbnailUrl = this.getYoutubeThumbnail(url); // Actualizar la miniatura
      } else {
        this.thumbnailUrl = null; // Limpiar la miniatura si no hay URL
      }
    });
  }

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

  /**
   * Genera la URL de la miniatura de YouTube a partir de una URL de video.
   * @param youtubeUrl - La URL del video de YouTube.
   * @returns La URL de la miniatura o una imagen predeterminada si no se puede extraer el ID.
   */
  getYoutubeThumbnail(youtubeUrl: string): string | null {
    const videoId = this.extractVideoIdFromUrl(youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Miniatura mediana (320x180)
    }
    return '/assets/videos/default-thumbnail.jpg'; // Imagen predeterminada
  }

  /**
   * Extrae el ID del video de una URL de YouTube.
   * @param url - La URL del video de YouTube.
   * @returns El ID del video o `null` si no se puede extraer.
   */
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