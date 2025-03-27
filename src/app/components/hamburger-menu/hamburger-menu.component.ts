import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent {
  isMenuClosed: boolean = false; 

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isMenuClosed = !this.isMenuClosed;
  }

  navigateTo(route: string): void {  
      this.router.navigate(['/listPlaylistProfile']);
    
  }
}