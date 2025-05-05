import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../../services/playlist.service';
import { ProfileService } from '../../../../services/profile.service';

import { HamburgerMenuComponent } from '../../../../../components/hamburger-menu/hamburger-menu.component'; // Import the component

interface Video {
  url?: string;
  thumbnail?: string;
  name: string;
  // Other properties that may exist...
}

// Define the interface for playlists
interface Playlist {
  _id: string;
  name: string;
  thumbnail?: string;
  videos: Video[];
  associatedProfiles: any[]; // You can define a more specific interface if needed
}

@Component({
  selector: 'app-list-playlist-profile',
  imports: [CommonModule, ReactiveFormsModule, HamburgerMenuComponent],
  templateUrl: './list-playlist-profile.component.html',
  styleUrl: './list-playlist-profile.component.css'
})
export class ListPlaylistProfileComponent {
  @ViewChild('character') character!: ElementRef;
  profiles: any[] = []; 
  playlists: Playlist[] = []; // Use the Playlist interface
  loading: boolean = true;
  error: string = '';
  profileId: string | null = null;
  isMenuOpen: boolean = false; // Track menu state
  ProfileName: string = '';
  constructor(
    private playlistService: PlaylistService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileId = this.profileService.getProfileId();
    this.loadPlaylists();
    this.loadProfileAvatar();  }

  ngAfterViewInit() {
    this.setupFloatingCharacter();
  }
  
  setupFloatingCharacter() {
    const element = this.character.nativeElement;
    let x = 0, y = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
  
    // Añadimos el SVG del osito
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
  
    // Escuchar movimiento del ratón
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  
    // Animación suave con requestAnimationFrame
    const animate = () => {
      x += (mouseX - x - 25) * 0.1;
      y += (mouseY - y - 25) * 0.1;
      element.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(animate);
    };
  
    animate();
  }
  loadProfileAvatar(): void {
    const profileId = this.profileService.getProfileId(); 
    if (profileId) {
      this.profileService.getProfileById(profileId).subscribe({
        next: (profile) => {
          this.ProfileName = profile.fullName || 'Usuario'; 
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.ProfileName = 'Usuario';
        }
      });
    } else {
      this.ProfileName = 'Usuario';
    }
  }
  // Loads playlists associated with the current profile
  loadPlaylists(): void {
    if (!this.profileId) return;
  
    this.playlistService.getPlaylistsByProfileId(this.profileId).subscribe({
      next: (playlists: Playlist[]) => {
  
       
  
        this.playlists = playlists;
       
      },
      error: (err) => {
        console.error('Error loading playlists:', err);
      }
    });
  }

  // Retrieves the thumbnail of the first video in the playlist
  getFirstVideoThumbnail(playlist: any): string | null {
    if (!playlist.videos || playlist.videos.length === 0) return null;

    const firstVideo = playlist.videos[0];
    if (firstVideo.url) {
      return this.getYoutubeThumbnail(firstVideo.url);
    }
    return firstVideo.thumbnail || null;
  }

  // Generates a YouTube thumbnail URL from a video URL
  getYoutubeThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  // Extracts the YouTube video ID from a URL
  extractVideoId(url: string): string {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  // Handles image loading errors by setting a default image
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.warn('Error loading image:', imgElement.src);
    imgElement.src = 'assets/images/default-thumbnail.jpg';
    imgElement.alt = 'Default image';
  }

  // Navigates to the playlist detail page
  navigateToPlaylist(playlistId: string): void {
    if (!playlistId) {
      return;
    }

    this.router.navigate(['/child-screen-playlist', playlistId]).then(nav => {
      console.log('Navigation success:', nav);
    }, err => {
    });
  }
  navigateToVideoList(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/video']);
  }

  // Navigates to the playlist list page
  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/Playlist']);
  }

  // Logs out the user and clears session storage
  logout(event: Event): void {
    event.preventDefault();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}