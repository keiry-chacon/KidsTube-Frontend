import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';


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
  selectedProfile: any = null; 
  isUserPinValidation: boolean = false;
  showUserPinDialog: boolean = false; 
  enteredUserPin: string = ''; 
  userPinError: boolean = false; 
  postValidationAction: boolean = false;
  visibleProfiles: any[] = [];
  currentPage: number = 0;
  profilesPerPage: number = 4; 
  totalPages: number = 0;

  constructor(
    private profileService: ProfileService, 
    private userService: UserService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfiles();
    this.loadPredefinedImages(); 

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
        this.calculatePages();
      },
      error: (err: any) => {
        console.error('Error al obtener perfiles:', err);
      }
    });
  }
  
   goToSettings() {
    this.openUserPinDialog();

  }

  ManageProfiles() {
    this.router.navigate(['/list-profile']);
  }

  openUserPinDialog() {
    this.showUserPinDialog = true;
    this.enteredUserPin = '';
    this.userPinError = false;
  }
  
  closeUserPinDialog() {
    this.showUserPinDialog = false;
    this.postValidationAction = false;
  }

  selectProfile(profile: any) {
    if (!this.showManageProfiles) {
      this.selectedProfile = profile;
      this.openProfilePinDialog();
    } else {
      console.warn('No se puede seleccionar un perfil mientras se gestionan perfiles.');
    }
  }

  openProfilePinDialog() {
    this.showPinDialog = true;
    this.enteredPin = '';
    this.pinError = false;
  }

  validateUserPin(): void {
    const pinToValidate = this.enteredUserPin.trim(); // Elimina espacios en blanco
  
    // Validación inicial: Verificar si el PIN está vacío
    if (!pinToValidate) {
      console.error('El PIN está vacío.');
      this.userPinError = true;
      return;
    }
  
    // Validación adicional: Verificar longitud mínima (por ejemplo, 4 dígitos)
    if (pinToValidate.length < 4) {
      console.error('El PIN debe tener al menos 4 dígitos.');
      this.userPinError = true;
      return;
    }
  
    this.userService.validateUserPin(pinToValidate).subscribe({
      next: (response) => {
        if (response.user) {
          console.log('PIN válido. Redirigiendo al usuario...');
          this.closeUserPinDialog(); 
          this.router.navigate(['/administration']); 
        } else {
          console.error('El PIN no coincide con ningún usuario.');
          this.userPinError = true; 
        }
      },
      error: (err) => {
        console.error('Error al validar el PIN del usuario:', err);
        this.userPinError = true; 
      }
    });
  }

validateProfilePin(): void {
  const pinToValidate = this.enteredPin;
  if (!this.selectedProfile) {
    console.error('No hay un perfil seleccionado.');
    return;
  }
  this.profileService.validatePin(this.selectedProfile._id, pinToValidate).subscribe({
    next: (response) => {
      if (response.profile) {
        this.closePinDialog();
        this.router.navigate(['/child-screen', this.selectedProfile._id]);
      } else {
        this.pinError = true; 
      }
    },
    error: (err) => {
      console.error('Error al validar el PIN del perfil:', err);
      this.pinError = true; 
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


  // Calcular el número total de páginas
  calculatePages() {
    this.totalPages = Math.ceil(this.profiles.length / this.profilesPerPage);
    this.updateVisibleProfiles();
  }

  // Actualizar los perfiles visibles según la página actual
  updateVisibleProfiles() {
    const start = this.currentPage * this.profilesPerPage;
    const end = start + this.profilesPerPage;
    this.visibleProfiles = this.profiles.slice(start, end);
  }

  // Navegar a la página anterior
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateVisibleProfiles();
    }
  }

  // Navegar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateVisibleProfiles();
    }
  }
  
}