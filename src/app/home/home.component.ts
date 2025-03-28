import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Navigates to the Log In page
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Navigates to the Sign Up page
  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}