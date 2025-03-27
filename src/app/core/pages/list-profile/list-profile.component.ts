import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


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
  predefinedImages: string[] = []; 
  dropdownOpen: boolean = false; 
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
    this.newProfile = { fullName: '', pin: '', avatar: '' }; // Reiniciar el formulario
    this.showAddProfileDialog = true;
  }

  closeAddProfileDialog() {
  this.showAddProfileDialog = false;
  }
  goBackToProfiles() {
  this.router.navigate(['/profiles']); 
  }
  selectNewProfileImage(img: string) {
  this.newProfile.avatar = img;
  this.toggleDropdown();
  }

  saveNewProfile() {
  if (!this.newProfile.fullName || !this.newProfile.pin || !this.newProfile.avatar) {
    console.error('Todos los campos son obligatorios.');
    return;
  }

  const newProfileData = {
    fullName: this.newProfile.fullName,
    pin: this.newProfile.pin,
    avatar: this.newProfile.avatar.split('/').pop(), 
  };

  this.profileService.createProfile(newProfileData).subscribe({
    next: (response) => {
      console.log('Perfil creado exitosamente:', response);
      this.loadProfiles(); 
      this.closeAddProfileDialog(); 
    },
    error: (err) => {
      console.error('Error al crear el perfil:', err);
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
          this.profiles = this.profiles.filter(p => p._id !== this.profileToDelete._id);
          this.showConfirmDelete = false;
          this.profileToDelete = null;
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
    this.profileToDelete = profile; 
  }
  
}
