import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css'],
  imports: [CommonModule],
  
})
export class HamburgerMenuComponent {
  isMenuClosed: boolean = false; 

  constructor(private router: Router,         private profileService: ProfileService,private playlistService: PlaylistService,
  ) {

    
  }

  toggleMenu(): void {
    this.isMenuClosed = !this.isMenuClosed;
  }

  navigateTo(route: string): void {  
      this.router.navigate([route]);

  }
  profileAvatar: string | null = null; 
  profileName: string = 'Usuario'; 

  getInitials(): string {
    return this.profileName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

 
  ngOnInit(): void {
    this.loadProfileAvatar();
  }
  goBackToProfiles() {
    this.router.navigate(['/profiles']); 
    }
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