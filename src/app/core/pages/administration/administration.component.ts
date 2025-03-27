import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent {
  currentUser = {
    fullName: 'John Doe',
    avatar: 'https://via.placeholder.com/150'
  };

  constructor(private router: Router) {}

  goBackToProfiles() {
    this.router.navigate(['/profiles']);
  }
  getuser() {
    this.router.navigate(['/profiles']);
  }
}
