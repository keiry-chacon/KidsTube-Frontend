import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';
import { VideoService } from '../../../../services/video.service';

@Component({
  selector: 'app-update-playlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-playlist.component.html',
  styleUrls: ['./update-playlist.component.css']
})
export class UpdatePlaylistComponent implements OnInit {
  playlistForm: FormGroup;
  profiles: any[] = [];
  videos: any[] = [];
  playlistId: string = '';
  currentPlaylist: any = null;

  // Arrays para mantener los IDs de los perfiles y videos seleccionados
  selectedProfiles: string[] = [];
  selectedVideos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required],
      associatedProfiles: [[], Validators.required],
      videos: [[]]
    });
  }

  ngOnInit() {
    this.loadProfiles();
    this.loadVideos();

    // Obtener el ID de la playlist desde los parámetros de la URL
    this.playlistId = this.route.snapshot.paramMap.get('id') || '';
    if (this.playlistId) {
      this.loadPlaylist();
    }
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
      next: (data) => this.videos = data,
      error: (err) => console.error('Error loading videos:', err)
    });
  }

  loadPlaylist() {
    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (playlist) => {
        this.currentPlaylist = playlist;

        // Cargar los valores iniciales en el formulario
        this.playlistForm.patchValue({
          name: playlist.name,
          associatedProfiles: playlist.associatedProfiles.map((profile: any) => profile._id),
          videos: playlist.videos.map((video: any) => video._id)
        });

        // Actualizar los arrays de selección
        this.selectedProfiles = playlist.associatedProfiles.map((profile: any) => profile._id);
        this.selectedVideos = playlist.videos.map((video: any) => video._id);
      },
      error: (err) => {
        console.error('Error loading playlist:', err);
        alert('Failed to load playlist. Check the console for details.');
      }
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

      this.playlistService.updatePlaylist(this.playlistId, formData).subscribe({
        next: () => {
          alert('Playlist updated successfully!');
          this.router.navigate(['/playlists']); // Redirigir a la lista de playlists
        },
        error: (err) => {
          console.error('Error updating playlist:', err);
          alert('Failed to update playlist. Check the console for details.');
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }

  cancel() {
    this.router.navigate(['/playlists']);
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