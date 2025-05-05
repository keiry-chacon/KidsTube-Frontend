import { Component, OnInit, ChangeDetectorRef ,ElementRef,ViewChild} from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HamburgerMenuComponent } from '../../../components/hamburger-menu/hamburger-menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ProfileService } from '../../services/profile.service';

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
  selector: 'app-child-screen-playlist',
  standalone: true,
  imports: [CommonModule, FormsModule, HamburgerMenuComponent],
  templateUrl: './child-screen-playlist.component.html',
  styleUrls: ['./child-screen-playlist.component.css']
})
export class ChildScreenPlaylistComponent implements OnInit {
  playlistId: string | null = null;
  playlists: Playlist[] = [];
  playlistVideos: Video[] = [];
  filteredVideos: Video[] = [];
  selectedVideo: Video | null = null;
  currentPlaylist: Playlist | null = null;
  searchQuery: string = '';
  fadeOut: boolean = false;
  isLoading: boolean = true;
  profileId: string | null = null;
  @ViewChild('character') character!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  // Initializes the component by loading the playlist and its videos
  initializeComponent(): void {
    this.isLoading = true;
    this.searchQuery = '';
    this.playlistId = this.route.snapshot.paramMap.get('playlistId') || '';
    this.loadSinglePlaylist();
  }
  ngAfterViewInit() {
    this.setupFloatingCharacter();
  }
  
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
  
    // Emoji de personaje o SVG
    element.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- Cabeza -->
  <circle cx="32" cy="32" r="20" fill="#fffde7"/>
  <!-- Orejas largas -->
  <ellipse cx="22" cy="10" rx="8" ry="16" fill="#fff0c0"/>
  <ellipse cx="42" cy="10" rx="8" ry="16" fill="#fff0c0"/>
  <!-- Ojos expresivos -->
  <circle cx="25" cy="30" r="3" fill="#444"/>
  <circle cx="39" cy="30" r="3" fill="#444"/>
  <!-- Nariz -->
  <path d="M32 36 L30 39 L34 39 Z" fill="#d97767"/>
  <!-- Boca -->
  <path d="M28 44 Q32 50 36 44" stroke="#444" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
    `;
  }
  // Loads a single playlist by its ID
  loadSinglePlaylist(): void {
    if (!this.playlistId) return;

    this.playlistService.getPlaylistById(this.playlistId).subscribe({
      next: (playlist: Playlist) => { 
        const videos = this.prepareVideos(playlist.videos, playlist.name);
        this.currentPlaylist = playlist; 
        this.playlistVideos = videos;
        this.filteredVideos = [...videos];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading playlist:', err); 
        this.isLoading = false;
      }
    });
  }

  // Prepares video data for display, including thumbnails and playlist names
  prepareVideos(videos: Video[], playlistName: string): Video[] {
    return videos.map(video => ({
      ...video,
      playlistName,
      isPlaying: false,
      isLoaded: false,
      thumbnail: video.thumbnail || this.getThumbnail(video.url)
    }));
  }

  // Navigates to a specific playlist page
  navigateToPlaylist(playlistId: string): void {
    this.router.navigate(['/child', playlistId]);
  }

  // Navigates to the all videos page
  navigateToAllVideos(): void {
    if (this.profileId) {
      this.router.navigate(['/child', { profileId: this.profileId }]);
    }
  }

  // Filters videos based on the search query
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

  // Plays the selected video
  playVideo(video: any): void {
    this.selectedVideo = video;
    video.isPlaying = true;
    video.isLoaded = false;
  }

  // Closes the currently playing video
  closeVideo(video: any): void {
    video.isPlaying = false;
    this.selectedVideo = null;
  }

  // Handles iframe load events for videos
  onIframeLoad(video: any): void {
    video.isLoaded = true;
    this.cdr.detectChanges();
  }

  // Generates a safe YouTube URL for embedding
  getSafeYouTubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Extracts the YouTube video ID from a URL
  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  // Retrieves the thumbnail URL for a video
  getThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Retrieves the thumbnail of the first video in a playlist
  getFirstVideoThumbnail(playlist: any): string {
    if (!playlist.videos?.length) return 'assets/images/default-thumbnail.jpg';
    return playlist.videos[0].thumbnail || this.getThumbnail(playlist.videos[0].url);
  }
}