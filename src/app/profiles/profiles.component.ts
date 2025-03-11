import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profiles',
  imports: [CommonModule],
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  profiles: any[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (data: any) => {  
        this.profiles = data;
      },
      error: (err: any) => {
        console.error('Error al obtener perfiles:', err);
      }
    });
  }
  
  

  selectProfile(profile: any) {
    console.log('Perfil seleccionado:', profile.fullName);
  }
}



