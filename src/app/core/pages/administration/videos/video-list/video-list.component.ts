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
}