import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { HamburgerMenuComponent } from '../../../components/hamburger-menu/hamburger-menu.component'; // Importa el componente

@Component({
  selector: 'app-list-playlist-profile',
  imports: [CommonModule, ReactiveFormsModule,HamburgerMenuComponent],
  templateUrl: './list-playlist-profile.component.html',
  styleUrl: './list-playlist-profile.component.css'
})
export class ListPlaylistProfileComponent {

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
}
