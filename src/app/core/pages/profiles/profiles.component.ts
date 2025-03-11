import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles',
  standalone: true, // Asegúrate de que standalone esté en true
  imports: [CommonModule, FormsModule], // Agrega FormsModule aquí
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  profiles: any[] = [];
  showPinDialog: boolean = false; // Controla la visibilidad del diálogo de PIN
  enteredPin: string = ''; // PIN ingresado por el usuario
  pinError: boolean = false; // Indica si el PIN es incorrecto
  userPin: string = ''; // PIN del usuario (deberías obtenerlo del backend)

  constructor(
    private profileService: ProfileService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfiles();
    this.getUserPin(); // Obtén el PIN del usuario al inicializar el componente
  }

  getUserPin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtén el usuario desde localStorage
    this.userPin = user.pin || ''; // Asigna el PIN del usuario
    console.log('PIN del usuario:', this.userPin); // Depuración
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (response: { data: any[] }) => {  
        console.log('Perfiles recibidos:', response.data); // Depuración
        this.profiles = response.data.map(profile => {
          return {
            ...profile,
            avatar: `../../../../assets/profiles/${profile.avatar}` // Actualiza la ruta de la imagen
          };
        });
      },
      error: (err: any) => {
        console.error('Error al obtener perfiles:', err);
      }
    });
  }
  
  selectProfile(profile: any) {
    console.log('Perfil seleccionado:', profile.fullName);
  }

  // Abre el diálogo de PIN
  openPinDialog() {
    this.showPinDialog = true;
    this.enteredPin = '';
    this.pinError = false;
  }

  // Cierra el diálogo de PIN
  closePinDialog() {
    this.showPinDialog = false;
  }

  // Verifica el PIN
  verifyPin() {
    if (this.enteredPin === this.userPin) {
      this.closePinDialog();
      this.router.navigate(['/administration']);
    } else {
      this.pinError = true;
    }
  }
}