import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent {
  isMenuClosed: boolean = false;

  constructor(private router: Router) {}

  // Toggles the menu open/closed state
  toggleMenu(): void {
    this.isMenuClosed = !this.isMenuClosed;
  }

  // Navigates to the video list page
  navigateToVideoList(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/videoList']);
  }

  // Navigates to the playlist list page
  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/listPlaylist']);
  }

  // Logs out the user and clears session storage
  logout(event: Event): void {
    event.preventDefault();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}