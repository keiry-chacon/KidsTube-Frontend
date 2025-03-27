import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

interface PredefinedImage {
  fullPath: string; // Ruta completa de la imagen
  fileName: string; // Nombre del archivo
}
@Component({
  selector: 'app-list-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-profile.component.html',
  styleUrls: ['./list-profile.component.css']
})

export class ListProfileComponent implements OnInit {
  profiles: any[] = [];
  showPinDialog: boolean = false;
  enteredPin: string = '';
  pinError: boolean = false;
  userPin: string = '';
  showEditProfile = false;
  editedProfile: any = {};
  showManageProfiles = false;
predefinedImages: PredefinedImage[] = [];  dropdownOpen: boolean = false; 
  profileToDelete: any = null;  
  showConfirmDelete = false;
  selectedProfile: any = null; 
  isUserPinValidation: boolean = false;
  showUserPinDialog: boolean = false; 
  enteredUserPin: string = ''; 
  userPinError: boolean = false; 
  showAddProfileDialog: boolean = false; 
  newProfile: any = { fullName: '', pin: '', avatar: '' };

  constructor(
    private profileService: ProfileService, 
    private userService: UserService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfiles();
    this.loadPredefinedImages(); 
    this.openUserPinDialog(); 

  }
  openAddProfileDialog() {
    this.newProfile = {
      fullName: '',
      pin: '',
      avatar: this.predefinedImages[0]?.fullPath || '', // Avatar predeterminado
      avatarName: this.getFileNameWithoutExtension(this.predefinedImages[0]?.fileName) || 'Seleccionar avatar', // Nombre del archivo
    };
    this.showAddProfileDialog = true;
  }

  closeAddProfileDialog() {
  this.showAddProfileDialog = false;
  }
  
  goBackToProfiles() {
  this.router.navigate(['/profiles']); 
  }
  selectNewProfileImage(fullPath: string) {
    const fileName = fullPath.split('/').pop() || 'Seleccionar avatar'; // Extraer el nombre del archivo

    this.newProfile.avatar = fullPath; // Para el cuadro de edición
    this.newProfile.avatarName = fileName; 
    this.dropdownOpen = false; // Cerrar el menú desplegable

  }
  getFileNameWithoutExtension(fileName: string): string {
    return fileName.split('.').slice(0, -1).join('.');
  }
  
  saveNewProfile() {
    const avatarName = this.newProfile.avatar.split('/').pop();
    this.newProfile.avatar = avatarName;
    this.profileService.createProfile(this.newProfile).subscribe({
      next: (response) => {
        this.loadProfiles();
        this.closeAddProfileDialog();

      },
      error: (err) => {
        console.error('Error al guardar el perfil:', err);
      }
    });
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
      this.profileService.deleteProfile(this.profileToDelete._id).subscribe({
        next: () => {
          alert('Perfil eliminado exitosamente.');
          this.profiles = this.profiles.filter(p => p._id !== this.profileToDelete._id);
          this.cancelDelete();
        },
        error: (err) => {
          alert('Error al eliminar el perfil. Por favor, inténtalo de nuevo.');
          console.error(err);
        },
      });
    }
  }

  selectProfileToDelete(profile: any) {
    this.profileToDelete = profile;
  }
  selectImage(fullPath: string) {
    const fileName = fullPath.split('/').pop() || 'Seleccionar avatar'; 
    
      this.editedProfile.avatar = fullPath; 
      this.editedProfile.avatarName = fileName; 
    
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
    
  

  openPinDialogForManageProfiles() {
  this.openUserPinDialog(); 
  }

  openUserPinDialog() {
    this.showUserPinDialog = true;
    this.enteredUserPin = '';
    this.userPinError = false;
  }

  closeUserPinDialog() {
    this.showUserPinDialog = false;
  }

  


  validateUserPin(): void {
    const pinToValidate = this.enteredUserPin;

    if (!pinToValidate) {
      console.error('El PIN está vacío.');
      this.userPinError = true;
      return;
    }

    this.userService.validateUserPin(pinToValidate).subscribe({
      next: (response) => {
        if (response.user) {
          this.closeUserPinDialog();
        
            this.showManageProfiles = true;
          
        } else {
          this.userPinError = true; 
        }
      },
      error: (err) => {
        console.error('Error al validar el PIN del usuario:', err);
        this.userPinError = true; 
      }
    });
  }


    
  closePinDialog() {
    this.showPinDialog = false;
  }


  editProfile(profile: any) {
    if (!this.showManageProfiles) {
      this.editedProfile = { ...profile };
      this.showEditProfile = true;
    } else {
      console.warn('La edición de perfiles está deshabilitada mientras se gestionan perfiles.');
    }
  }
  loadPredefinedImages() {
    const imageNames = [
      'rapunzel.png',
      'cocomelon.jpg',
      'gato.png',
      'peppa.jpg',
      'dora.jpg',
      'hellokitty.jpg',
    ];
  
    this.predefinedImages = imageNames.map(name => ({
      fullPath: `../../../assets/profiles/${name}`, // Ruta completa
      fileName: name, // Solo el nombre del archivo
    }));
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

  
  openEditProfile(profile: any) {
    this.editedProfile = { ...profile };
    this.showEditProfile = true;
    this.profileToDelete = profile; 
  }
  
}
