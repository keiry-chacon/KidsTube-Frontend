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

  toggleMenu(): void {
    this.isMenuClosed = !this.isMenuClosed;
  }

  navigateToVideoList(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/videoList']);
  }

  navigateToListPlaylist(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/listPlaylist']);
  }

  logout(event: Event): void {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    sessionStorage.clear(); // Limpia todo el contenido del sessionStorage
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}