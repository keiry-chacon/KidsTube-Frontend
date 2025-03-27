import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';

import { HamburgerMenuComponent } from '../../../../../components/hamburger-menu/hamburger-menu.component'; // Importa el componente
interface Video {
  url?: string;
  thumbnail?: string;
  name: string;
  // otras propiedades que puedan existir...
}

// Define la interfaz para las playlists
interface Playlist {
  _id: string;
  name: string;
  thumbnail?: string;
  videos: Video[];
  associatedProfiles: any[]; // Puedes definir una interfaz más específica si es necesario
}
@Component({
  selector: 'app-list-playlist-profile',
  imports: [CommonModule, ReactiveFormsModule,HamburgerMenuComponent],
  templateUrl: './list-playlist-profile.component.html',
  styleUrl: './list-playlist-profile.component.css'
})
export class ListPlaylistProfileComponent {

  playlists: Playlist[] = []; // Usa la interfaz Playlist
  loading: boolean = true;
  error: string = '';
  profileId: string | null = null;

  constructor(
    private playlistService: PlaylistService,
        private profileService: ProfileService,
    
    private router: Router
  ) {}

  ngOnInit() {
    this.profileId = this.profileService.getProfileId();
    this.loadPlaylists();
  }
 
  loadPlaylists() {
    if (!this.profileId) {
      this.router.navigate(['/profiles']);
      return;
    }
    this.playlistService.getPlaylistsByProfileId(this.profileId).subscribe({
      next: (data: Playlist[]) => {
        console.log('Data received from service:', data); // Inspecciona los datos
  
        this.playlists = data.map((playlist: Playlist) => ({
          ...playlist,
          thumbnail: this.getFirstVideoThumbnail(playlist) || 'assets/images/default-thumbnail.jpg'
        }));
  
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading playlists:', err);
        this.error = 'Failed to load playlists.';
        this.loading = false;
      }
    });
  }

  getFirstVideoThumbnail(playlist: any): string | null {
    if (!playlist.videos || playlist.videos.length === 0) return null;
    
    const firstVideo = playlist.videos[0];
    if (firstVideo.url) {
      return this.getYoutubeThumbnail(firstVideo.url);
    }
    return firstVideo.thumbnail || null;
  }

  getYoutubeThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.warn('Error al cargar imagen:', imgElement.src);
    imgElement.src = 'assets/images/default-thumbnail.jpg';
    imgElement.alt = 'Imagen por defecto';
  }
  navigateToPlaylist(playlistId: string): void {
    if (!playlistId) {
      console.error('Playlist ID is missing or invalid.');
      return;
    }
  
    console.log('Navigating to playlist with ID:', playlistId); // Inspecciona el ID
    this.router.navigate(['/child-screen-playlist', playlistId]).then(nav => {
      console.log('Navigation success:', nav);
    }, err => {
      console.error('Navigation error:', err);
    });
  }
}
