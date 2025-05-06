import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HamburgerMenuComponent } from '../../../components/hamburger-menu/hamburger-menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

// Interface for video data
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

// Interface for playlist data
interface Playlist {
  _id: string;
  name: string;
  videos: Video[];
  thumbnail?: string;
}

// Interface for playlist API response
export interface PlaylistResponse {
  id: string;
  name: string;
  videos: Video[];
  associatedProfiles: string[];
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

  // Reference to the floating character element
  @ViewChild('character') character!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle hook: initializes the component
  ngOnInit(): void {
    this.profileId = this.profileService.getProfileId();
    this.initializeComponent();
  }

  // Loads profile playlists and video data
  initializeComponent(): void {
    this.isLoading = true;
    this.searchQuery = '';

    if (this.profileId) {
      this.loadAllProfilePlaylists();
    } else {
      this.router.navigate(['/']);
    }
  }

  // Lifecycle hook: called after the view is initialized
  ngAfterViewInit() {
    this.setupFloatingCharacter();
  }

  // Sets up animation for floating character following the mouse
  setupFloatingCharacter() {
    const element = this.character.nativeElement;
    let x = 0, y = 0;
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      x += (mouseX - x - 25) * 0.1;
      y += (mouseY - y - 25) * 0.1;
      element.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(animate);
    }

    animate();

    // Character SVG or emoji
    element.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="20" fill="#fffde7"/>
        <ellipse cx="22" cy="10" rx="8" ry="16" fill="#fff0c0"/>
        <ellipse cx="42" cy="10" rx="8" ry="16" fill="#fff0c0"/>
        <circle cx="25" cy="30" r="3" fill="#444"/>
        <circle cx="39" cy="30" r="3" fill="#444"/>
        <path d="M32 36 L30 39 L34 39 Z" fill="#d97767"/>
        <path d="M28 44 Q32 50 36 44" stroke="#444" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Loads all playlists linked to the current profile
  loadAllProfilePlaylists(): void {
    if (!this.profileId) return;

    this.playlistService.getPlaylistsByProfileId(this.profileId).subscribe({
      next: (playlists: Playlist[]) => {
        console.log('Received playlists:', playlists);

        const allVideos = playlists.flatMap((playlist: Playlist) =>
          this.prepareVideos(playlist.videos, playlist.name)
        );

        console.log('All videos:', allVideos);

        this.playlists = playlists;
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

  // Truncates long video descriptions
  truncateDescription(description: string): string {
    const maxLength = 50;
    return description && description.length > maxLength
      ? `${description.slice(0, maxLength)}...`
      : description;
  }

  // Prepares video objects for display with extra metadata
  prepareVideos(videos: Video[], playlistName: string): Video[] {
    return videos.map((video: Video) => ({
      ...video,
      playlistName,
      isPlaying: false,
      isLoaded: false,
      thumbnail: video.thumbnail || this.getThumbnail(video.url)
    }));
  }

  // Navigates to a specific playlist
  navigateToPlaylist(playlistId: string): void {
    this.router.navigate(['/child', playlistId]);
  }

  // Navigates to the "All Videos" view
  navigateToAllVideos(): void {
    if (this.profileId) {
      this.router.navigate(['/child', { profileId: this.profileId }]);
    }
  }

  // Filters the video list based on user input
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

  // Starts video playback
  playVideo(video: Video): void {
    this.selectedVideo = video;
    video.isPlaying = true;
    video.isLoaded = false;
  }

  // Stops video playback
  closeVideo(video: Video): void {
    video.isPlaying = false;
    this.selectedVideo = null;
  }

  // Called when the video iframe finishes loading
  onIframeLoad(video: Video): void {
    video.isLoaded = true;
    this.cdr.detectChanges();
  }

  // Returns a secure embed URL for a YouTube video
  getSafeYouTubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Extracts YouTube video ID from a URL
  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  // Gets the thumbnail URL for a video
  getThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Gets the thumbnail of the first video in a playlist
  getFirstVideoThumbnail(playlist: Playlist): string {
    if (!playlist.videos?.length) return 'assets/images/default-thumbnail.jpg';
    return playlist.videos[0].thumbnail || this.getThumbnail(playlist.videos[0].url);
  }
}
