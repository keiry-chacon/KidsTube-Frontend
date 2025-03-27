import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HamburgerMenuComponent } from '../../../components/hamburger-menu/hamburger-menu.component'; // Importa el componente
@Component({
  selector: 'app-child-screen',
  imports: [CommonModule, FormsModule, HamburgerMenuComponent],
  templateUrl: './child-screen.component.html',
  styleUrls: ['./child-screen.component.css']
})
export class ChildScreenComponent {
  profileId: string = '';
  playlists: any[] = [];
  playlistVideos: any[] = [];
  selectedVideo: any = null;
  searchQuery: string = '';
  filteredVideos: any[] = [];
  fadeOut: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filteredVideos = [...this.playlistVideos];
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'] || '';

      if (this.profileId) {
        this.loadPlaylistsForProfile();
      }
    });
  }

  loadPlaylistsForProfile(): void {
    this.playlistService.getPlaylistsByProfileId(this.profileId).subscribe({
      next: (response) => {
        this.playlists = response;
        this.playlistVideos = this.playlists.flatMap(playlist =>
          playlist.videos.map((video: any) => ({
            ...video,
            isPlaying: false,
            isLoaded: false
          }))
        );
        this.filteredVideos = [...this.playlistVideos];       },
      error: (err) => {
        console.error('Error al cargar las playlists del perfil:', err);
      }
    });
  }

  getSafeYouTubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    if (!match) {
      console.error('URL inválida:', url);
      return '';
    }
    return match[1];
  }

  getThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  playVideo(video: any): void {
    console.log('Reproduciendo video:', video.name);
    this.selectedVideo = video;
    video.isPlaying = true;
    video.isLoaded = false;
    this.cdr.detectChanges();
  }

  closeVideo(video: any): void {
    video.isPlaying = false;
    this.selectedVideo = null;
  }

  onIframeLoad(video: any): void {
    console.log('Iframe cargado para el video:', video.name);
    video.isLoaded = true;
  }

  filterVideos(): void {
    this.fadeOut = true;
    setTimeout(() => {
      this.filteredVideos = this.playlistVideos.filter((video) =>
        video.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      console.log('Filtrando videos:', this.searchQuery, this.filteredVideos); // Depuración
      this.fadeOut = false;
    }, 300);
  }
}
