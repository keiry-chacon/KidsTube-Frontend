import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent {
  isMenuOpen: boolean = true;
  isMenuClosed: boolean = false;

  constructor(private router: Router) {}

  // Toggles the menu open/closed state
  toggleMenu(): void {
    this.isMenuClosed = !this.isMenuClosed;
  }

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
    this.router.navigate(['/child-screen']);
  }

  // Navigates to the playlist list page
  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/Playlist']);
  }

  // Logs out the user and clears session storage
  back(event: Event): void {
    event.preventDefault();
    sessionStorage.clear();
    this.router.navigate(['/list-profile']);
  }
}