import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HamburgerMenuComponent } from '../../../components/hamburger-menu/hamburger-menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

// Video interface structure
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

// Playlist interface structure
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

  // Lifecycle hook: initializes component
  ngOnInit(): void {
    this.initializeComponent();
  }

  // Lifecycle hook: sets up floating character animation after view loads
  ngAfterViewInit() {
    this.setupFloatingCharacter();
  }

  // Initializes component state and loads playlist
  initializeComponent(): void {
    this.isLoading = true;
    this.searchQuery = '';
    this.playlistId = this.route.snapshot.paramMap.get('playlistId') || '';
    this.loadSinglePlaylist();
  }

  // Creates a floating animated character that follows the cursor
  setupFloatingCharacter(): void {
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

    // Display SVG character
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

  // Loads a playlist by its ID and prepares its videos
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

  // Adds metadata to videos such as thumbnails and state flags
  prepareVideos(videos: Video[], playlistName: string): Video[] {
    return videos.map(video => ({
      ...video,
      playlistName,
      isPlaying: false,
      isLoaded: false,
      thumbnail: video.thumbnail || this.getThumbnail(video.url)
    }));
  }

  // Navigates to a specific playlist by its ID
  navigateToPlaylist(playlistId: string): void {
    this.router.navigate(['/child', playlistId]);
  }

  // Navigates back to all videos for the current profile
  navigateToAllVideos(): void {
    if (this.profileId) {
      this.router.navigate(['/child', { profileId: this.profileId }]);
    }
  }

  // Filters playlist videos based on the search input
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

  // Sets a video as selected and starts playback
  playVideo(video: Video): void {
    this.selectedVideo = video;
    video.isPlaying = true;
    video.isLoaded = false;
  }

  // Closes the currently playing video
  closeVideo(video: Video): void {
    video.isPlaying = false;
    this.selectedVideo = null;
  }

  // Marks a video as loaded when the iframe finishes loading
  onIframeLoad(video: Video): void {
    video.isLoaded = true;
    this.cdr.detectChanges();
  }

  // Returns a trusted embed URL for a YouTube video
  getSafeYouTubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Extracts the video ID from a YouTube URL
  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  // Returns the thumbnail image URL for a YouTube video
  getThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Gets the thumbnail for the first video in a playlist
  getFirstVideoThumbnail(playlist: Playlist): string {
    if (!playlist.videos?.length) return 'assets/images/default-thumbnail.jpg';
    return playlist.videos[0].thumbnail || this.getThumbnail(playlist.videos[0].url);
  }
}
