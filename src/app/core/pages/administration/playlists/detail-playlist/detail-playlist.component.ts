import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';

@Component({
  selector: 'app-detail-playlist',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './detail-playlist.component.html',
  styleUrls: ['./detail-playlist.component.css']
})
export class DetailPlaylistComponent implements OnInit {
  playlist: any = {}; // Almacena los datos de la playlist
  playlistId: string = ''; // ID de la playlist actual

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    // Obtener el ID de la playlist desde los parámetros de la URL
    this.playlistId = this.route.snapshot.paramMap.get('id') || '';

    if (this.playlistId) {
      this.loadPlaylist();
    }
  }

  loadPlaylist() {
    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (data) => {
        this.playlist = data;
      },
      error: (err) => {
        console.error('Error loading playlist:', err);
        alert('Failed to load playlist. Check the console for details.');
      }
    });
  }

  goBack() {
    window.history.back(); // Regresar a la página anterior
  }
}