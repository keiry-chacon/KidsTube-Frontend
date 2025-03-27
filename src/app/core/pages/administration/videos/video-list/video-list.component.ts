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

  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos = data;
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        alert('Failed to load videos. Check the console for details.');
      }
    });
  }

  editVideo(id: string) {
    console.log('Editing video with ID:', id); // Verifica que el ID sea correcto
    this.router.navigate(['/updateVideo', id]); // Navegar a la página de edición
  }

  viewDetails(id: string) {
    console.log('Viewing details for video with ID:', id); // Verifica que el ID sea correcto
    this.router.navigate(['/detailVideo', id]); // Navegar a la página de detalles
  }

  deleteVideo(id: string) {
    if (confirm('Are you sure you want to delete this video?')) {
      this.videoService.deleteVideo(id).subscribe({
        next: () => {
          alert('Video deleted successfully!');
          this.loadVideos(); // Recargar la lista después de eliminar
        },
        error: (err) => {
          console.error('Error deleting video:', err);
          alert('Failed to delete video. Check the console for details.');
        }
      });
    }
  }

  createNewVideo() {
    this.router.navigate(['/createVideo']);
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