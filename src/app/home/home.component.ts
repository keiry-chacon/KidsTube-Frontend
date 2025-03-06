import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Navegar a la página de Log In
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Navegar a la página de Sign Up
  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}
