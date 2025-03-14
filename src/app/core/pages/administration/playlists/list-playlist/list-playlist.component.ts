import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';

@Component({
  selector: 'app-list-playlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-playlist.component.html',
  styleUrls: ['./list-playlist.component.css']
})
export class ListPlaylistComponent implements OnInit {
  playlists: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading playlists:', err);
        this.error = 'Failed to load playlists. Check the console for details.';
        this.loading = false;
      }
    });
  }

  createNewPlaylist() {
    this.router.navigate(['/createPlaylist']);
  }

  editPlaylist(id: string) {
    this.router.navigate(['/updatePlaylist', id]);
  }

  viewDetails(id: string) {
    console.log('Viewing details for Playlist with ID:', id); // Verifica que el ID sea correcto
    this.router.navigate(['/detailPlaylist', id]);
  }

  deletePlaylist(id: string) {
    if (confirm('Are you sure you want to delete this playlist?')) {
      this.playlistService.deletePlaylist(id).subscribe({
        next: () => {
          alert('Playlist deleted successfully!');
          this.loadPlaylists(); // Recargar la lista después de eliminar
        },
        error: (err) => {
          console.error('Error deleting playlist:', err);
          alert('Failed to delete playlist. Check the console for details.');
        }
      });
    }
  }
}