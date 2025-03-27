import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-create-playlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {
  playlistForm: FormGroup;
  profiles: any[] = [];
  videos: any[] = [];
  selectedProfiles: string[] = []; // Array para almacenar los IDs de los perfiles seleccionados
  selectedVideos: string[] = [];   // Array para almacenar los IDs de los videos seleccionados

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private videoService: VideoService,
    private router: Router
  ) {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
      associatedProfiles: [[], Validators.required], // Array vacío inicial
      videos: [[], Validators.required]              // Array vacío inicial
    });
  }

  ngOnInit() {
    this.loadProfiles();
    this.loadVideos();
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (response) => {
        this.profiles = response.data || response;
      },
      error: (err) => {
        console.error('Error loading profiles:', err);
        alert('Failed to load profiles. Check the console for details.');
      }
    });
  }

  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        console.log('Videos loaded:', data); // Inspecciona los datos en la consola
        this.videos = data;
      },
      error: (err) => console.error('Error loading videos:', err)
    });
  }

  toggleProfileSelection(profileId: string): void {
    const index = this.selectedProfiles.indexOf(profileId);
    if (index === -1) {
      this.selectedProfiles.push(profileId); // Agregar perfil si no está seleccionado
    } else {
      this.selectedProfiles.splice(index, 1); // Eliminar perfil si ya está seleccionado
    }
    this.playlistForm.patchValue({ associatedProfiles: this.selectedProfiles }); // Actualizar el formulario
  }

  isSelected(profileId: string): boolean {
    return this.selectedProfiles.includes(profileId);
  }

  toggleVideoSelection(videoId: string): void {
    const index = this.selectedVideos.indexOf(videoId);
    if (index === -1) {
      this.selectedVideos.push(videoId); // Agregar video si no está seleccionado
    } else {
      this.selectedVideos.splice(index, 1); // Eliminar video si ya está seleccionado
    }
    this.playlistForm.patchValue({ videos: this.selectedVideos }); // Actualizar el formulario
  }

  isVideoSelected(videoId: string): boolean {
    return this.selectedVideos.includes(videoId);
  }

  getAvatarUrl(avatarFileName: string): string {
    if (!avatarFileName) {
      return '/assets/profiles/default-avatar.jpg'; // Imagen predeterminada si no hay avatar
    }
    return `/assets/profiles/${avatarFileName}`; // Ruta basada en el nombre del archivo
  }

  getYoutubeThumbnail(youtubeUrl: string): string {
    const videoId = this.extractVideoIdFromUrl(youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Miniatura mediana (320x180)
    }
    return '/assets/videos/default-thumbnail.jpg'; // Imagen predeterminada si no se puede extraer el ID
  }

  extractVideoIdFromUrl(url: string): string | null {
    // Expresión regular para extraer el ID del video de YouTube
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  onSubmit() {
    if (this.playlistForm.valid) {
      const formData = this.playlistForm.value;
      console.log('Sending data:', formData);

      this.playlistService.createPlaylist(formData).subscribe({
        next: (response) => {
          alert('Playlist created successfully!');
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Error creating playlist. Try again later.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
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
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    sessionStorage.clear(); // Limpia todo el contenido del sessionStorage
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}