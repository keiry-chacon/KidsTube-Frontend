import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profiles',
  imports: [CommonModule],
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent {
  profiles = [
    { name: 'Keiry', image: './assets/profiles/R (2).jpg' },
    { name: 'Gredy', image: '/assets/profiles/OIP (7).jpg' },
    { name: 'Bladimir', image: '/assets/profiles/9e4c756c7e183285dc5113062cf2c2b3.jpg' }

  ];

  selectProfile(profile: any) {
    console.log('Perfil seleccionado:', profile.name);
  }
}



