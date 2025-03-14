import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})

export class ProfilesComponent implements OnInit {
  profiles: any[] = [];
  showPinDialog: boolean = false;
  enteredPin: string = '';
  pinError: boolean = false;
  userPin: string = '';
  showEditProfile = false;
  editedProfile: any = {};
  showManageProfiles = false;
  predefinedImages: string[] = []; 
  dropdownOpen: boolean = false; 
  profileToDelete: any = null;  
  showConfirmDelete = false;

  constructor(
    private profileService: ProfileService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfiles();
    this.getUserPin();
    this.loadPredefinedImages(); 

  }

  getUserPin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userPin = user.pin || '';
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  confirmDelete() {
    this.showConfirmDelete = true;
  }

  cancelDelete() {
    this.showConfirmDelete = false;
  }
  deleteProfile() {
    if (this.profileToDelete) {
      console.log('Eliminando perfil:', this.profileToDelete); 
      this.profileService.deleteProfile(this.profileToDelete._id).subscribe({
        next: () => {
          this.profiles = this.profiles.filter(p => p._id !== this.profileToDelete._id);
          this.showConfirmDelete = false;
          console.log('Perfil eliminado exitosamente');
        },
        error: (err: any) => {
          console.error('Error al eliminar el perfil:', err);
        }
      });
    }
  }
  
  selectProfileToDelete(profile: any) {
    this.profileToDelete = profile;
  }
  selectImage(img: string) {
    this.editedProfile.avatar = img;
    this.dropdownOpen = false; 
  }
  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (response: { data: any[] }) => {  
        this.profiles = response.data.map(profile => {
          return {
            ...profile,
            avatar: `../../../assets/profiles/${profile.avatar}`
          };
        });
      },
      error: (err: any) => {
        console.error('Error al obtener perfiles:', err);
      }
    });
  }
  
  goToSettings() {
    this.router.navigate(['/administration']);  // Esto redirige al componente de configuración
  }
  selectProfile(profile: any) {
    console.log('Perfil seleccionado:', profile.fullName);
  }

  openPinDialog() {
    this.showPinDialog = true;
    this.enteredPin = '';
    this.pinError = false;
  }

  closePinDialog() {
    this.showPinDialog = false;
  }

  verifyPin() {
    if (this.enteredPin === this.userPin) {
      this.closePinDialog();
      this.showManageProfiles = true;
    } else {
      this.pinError = true;
    }
  }

  editProfile(profile: any) {
    this.editedProfile = { ...profile };
    this.showEditProfile = true;
  }
  loadPredefinedImages() {
    const imageNames = [
      'rapunzel.png',
      'cocomelon.jpg',
      'gato.png',
    ];

    this.predefinedImages = imageNames.map(name => `.../../../../assets/profiles/${name}`);
  }
  saveProfile() {
    const avatarName = this.editedProfile.avatar.split('/').pop();
    this.editedProfile.avatar = avatarName;
    this.profileService.updateProfile(this.editedProfile).subscribe({
      next: (response) => {
        const index = this.profiles.findIndex(p => p._id === this.editedProfile._id);
        if (index !== -1) {
          this.editedProfile.avatar = `../../../../assets/profiles/${avatarName}`;
          this.profiles[index] = { ...this.editedProfile }; 
        }      
      this.showEditProfile = false; 

      },
      error: (err) => {
        console.error('Error al guardar el perfil:', err);
      }
    });
  }
  
  

  cancelEdit() {
    this.showEditProfile = false;
  }

  addProfile() {
  }
  openEditProfile(profile: any) {
    this.editedProfile = { ...profile };
    this.showEditProfile = true;
  }
  
}