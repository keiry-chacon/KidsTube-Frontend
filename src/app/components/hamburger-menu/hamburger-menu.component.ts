import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css'],
  imports: [CommonModule],
})
export class HamburgerMenuComponent {
  isMenuClosed: boolean = false; // Indicates if the menu is closed or open

  constructor(
    private router: Router, 
    private profileService: ProfileService, 
    private playlistService: PlaylistService
  ) {}

  clickSound = new Audio('assets/sounds/click.mp3');

  // Plays the click sound
  playSound() {
    this.clickSound.currentTime = 0;
    this.clickSound.play().catch(() => {});
  }

  // Toggles the menu open or closed
  toggleMenu(): void {
    this.playSound();
    this.isMenuClosed = !this.isMenuClosed;
  }

  // Navigates to the specified route
  navigateTo(route: string): void {  
    this.playSound();
    this.router.navigate([route]);
  }

  profileAvatar: string | null = null; 
  profileName: string = 'Usuario'; 

  // Returns the initials of the profile name
  getInitials(): string {
    return this.profileName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  // Loads the profile avatar on initialization
  ngOnInit(): void {
    this.loadProfileAvatar();
  }

  // Navigates back to the profiles page
  goBackToProfiles() {
    this.playSound();
    this.router.navigate(['/profiles']);
  }

  // Loads the profile avatar and name from the profile service
  loadProfileAvatar(): void {
    const profileId = this.profileService.getProfileId();
    if (profileId) {
      this.profileService.getProfileById(profileId).subscribe({
        next: (profile) => {
          this.profileAvatar = profile.avatar
            ? `../../../../../../assets/profiles/${profile.avatar}`
            : 'assets/images/default-avatar.png';
          this.profileName = profile.fullName || 'Usuario';
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.profileAvatar = 'assets/images/default-avatar.png';
          this.profileName = 'Usuario';
        }
      });
    }
  }
}
