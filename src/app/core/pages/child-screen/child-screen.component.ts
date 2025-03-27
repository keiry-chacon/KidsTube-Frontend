import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HamburgerMenuComponent } from '../../../components/hamburger-menu/hamburger-menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
interface Video {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  isPlaying?: boolean;
  isLoaded?: boolean;
  playlistName?: string;
}

interface Playlist {
  id: string;
  name: string;
  videos: Video[];
  thumbnail?: string;
}

@Component({
  selector: 'app-child-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, HamburgerMenuComponent],
  templateUrl: './child-screen.component.html',
  styleUrls: ['./child-screen.component.css']
})
export class ChildScreenComponent implements OnInit {
  playlistId: string | null = null;
  profileId: string | null = null;
  playlists: Playlist[] = [];
  playlistVideos: Video[] = [];
  filteredVideos: Video[] = [];
  selectedVideo: Video | null = null;
  currentPlaylist: Playlist | null = null;
  searchQuery: string = '';
  fadeOut: boolean = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.playlistId = params['playlistId'] || null;
      this.profileId = params['profileId'] || null;
      this.initializeComponent();
    });
  }

  initializeComponent(): void {
    this.isLoading = true;
    this.searchQuery = '';
    
    if (this.playlistId) {
      this.loadSinglePlaylist();
    } else if (this.profileId) {
      this.loadAllProfilePlaylists();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadSinglePlaylist(): void {
    if (!this.playlistId) return;

    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (playlist: Playlist) => {
        this.currentPlaylist = playlist;
        this.playlistVideos = this.prepareVideos(playlist.videos, playlist.name);
        this.filteredVideos = [...this.playlistVideos];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading playlist:', err);
        this.isLoading = false;
      }
    });
  }

  loadAllProfilePlaylists(): void {
    if (!this.profileId) return;

    this.playlistService.getPlaylistsByProfileId(this.profileId).subscribe({
      next: (playlists: Playlist[]) => {
        this.playlists = playlists;
        const allVideos = playlists.flatMap((playlist: Playlist) => 
          this.prepareVideos(playlist.videos, playlist.name)
        );
        this.playlistVideos = allVideos;
        this.filteredVideos = [...allVideos];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading playlists:', err);
        this.isLoading = false;
      }
    });
  }

  prepareVideos(videos: Video[], playlistName: string): Video[] {
    return videos.map((video: Video) => ({
      ...video,
      playlistName,
      isPlaying: false,
      isLoaded: false,
      thumbnail: video.thumbnail || this.getThumbnail(video.url)
    }));
  }


  // Navegación
  navigateToPlaylist(playlistId: string): void {
    this.router.navigate(['/child', playlistId]);
  }

  navigateToAllVideos(): void {
    if (this.profileId) {
      this.router.navigate(['/child', { profileId: this.profileId }]);
    }
  }

  // Búsqueda y filtrado
  filterVideos(): void {
    this.fadeOut = true;
    setTimeout(() => {
      const query = this.searchQuery.toLowerCase();
      this.filteredVideos = this.playlistVideos.filter(video =>
        video.name.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.playlistName?.toLowerCase().includes(query)
      );
      this.fadeOut = false;
    }, 300);
  }

  // Manejo de videos
  playVideo(video: any): void {
    this.selectedVideo = video;
    video.isPlaying = true;
    video.isLoaded = false;
  }

  closeVideo(video: any): void {
    video.isPlaying = false;
    this.selectedVideo = null;
  }

  onIframeLoad(video: any): void {
    video.isLoaded = true;
    this.cdr.detectChanges();
  }

  // Helpers para videos
  getSafeYouTubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  getThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  getFirstVideoThumbnail(playlist: any): string {
    if (!playlist.videos?.length) return 'assets/images/default-thumbnail.jpg';
    return playlist.videos[0].thumbnail || this.getThumbnail(playlist.videos[0].url);
  }
}