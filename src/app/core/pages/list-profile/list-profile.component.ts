import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

interface PredefinedImage {
  fullPath: string; // Full path of the image
  fileName: string; // File name
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
  predefinedImages: PredefinedImage[] = [];
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

  // Opens the dialog to add a new profile
  openAddProfileDialog() {
    this.newProfile = {
      fullName: '',
      pin: '',
      avatar: this.predefinedImages[0]?.fullPath || '', // Default avatar
      avatarName: this.getFileNameWithoutExtension(this.predefinedImages[0]?.fileName) || 'Select avatar', // File name
    };
    this.showAddProfileDialog = true;
  }

  // Closes the dialog to add a new profile
  closeAddProfileDialog() {
    this.showAddProfileDialog = false;
  }

  // Navigates back to the profiles page
  goBackToProfiles() {
    this.router.navigate(['/profiles']);
  }

  // Selects a new profile image
  selectNewProfileImage(fullPath: string) {
    const fileName = fullPath.split('/').pop() || 'Select avatar'; // Extract file name

    this.newProfile.avatar = fullPath; // For the edit box
    this.newProfile.avatarName = fileName;
    this.dropdownOpen = false; // Close the dropdown menu
  }

  // Extracts the file name without its extension
  
  getFileNameWithoutExtension(filePath: string): string {
    if (!filePath) return ''; // Si filePath es nulo o vacío, retorna una cadena vacía
  
    const fileName = filePath.split('/').pop(); // Extraer el nombre del archivo
    if (!fileName) return ''; // Si fileName es undefined, retorna una cadena vacía
  
    return fileName.split('.').slice(0, -1).join('.'); // Eliminar la extensión
  }
  // Saves the new profile
  saveNewProfile() {
    const avatarName = this.newProfile.avatar.split('/').pop();
    this.newProfile.avatar = avatarName;
    this.profileService.createProfile(this.newProfile).subscribe({
      next: (response) => {
        this.loadProfiles();
        this.closeAddProfileDialog();
      },
      error: (err) => {
      }
    });
  }

  // Toggles the dropdown menu
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Confirms the deletion of a profile
  confirmDelete() {
    this.showConfirmDelete = true;
  }

  // Cancels the deletion of a profile
  cancelDelete() {
    this.showConfirmDelete = false;
  }

  // Deletes a profile
  deleteProfile() {
    if (this.profileToDelete) {
      this.profileService.deleteProfile(this.profileToDelete._id).subscribe({
        next: () => {
          alert('Profile deleted successfully.');
          this.profiles = this.profiles.filter(p => p._id !== this.profileToDelete._id);
          this.cancelDelete();
        },
        error: (err) => {
          alert('Error deleting profile. Please try again.');
        },
      });
    }
  }

  // Selects a profile for deletion
  selectProfileToDelete(profile: any) {
    this.profileToDelete = profile;
  }

  // Selects an image for the profile
  selectImage(fullPath: string) {
    const fileName = fullPath.split('/').pop() || 'Select avatar';

    this.editedProfile.avatar = fullPath;
    this.editedProfile.avatarName = fileName;

    this.dropdownOpen = false;
  }

  // Loads all profiles
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
      }
    });
  }

  // Opens the PIN dialog for managing profiles
  openPinDialogForManageProfiles() {
    this.openUserPinDialog();
  }

  // Opens the user PIN dialog
  openUserPinDialog() {
    this.showUserPinDialog = true;
    this.enteredUserPin = '';
    this.userPinError = false;
  }

  // Closes the user PIN dialog
  closeUserPinDialog() {
    this.showUserPinDialog = false;
  }

  // Validates the user PIN
  validateUserPin(): void {
    const pinToValidate = this.enteredUserPin;

    if (!pinToValidate) {
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
        this.userPinError = true;
      }
    });
  }

  // Closes the PIN dialog
  closePinDialog() {
    this.showPinDialog = false;
  }

  // Edits a profile
  editProfile(profile: any) {
    if (!this.showManageProfiles) {
      this.editedProfile = { ...profile };
      this.showEditProfile = true;
    } else {
      console.warn('Profile editing is disabled while managing profiles.');
    }
  }

  // Loads predefined images for avatars
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
      fullPath: `../../../assets/profiles/${name}`, // Full path
      fileName: name, // File name only
    }));
  }

  // Saves the edited profile
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
      }
    });
  }

  // Cancels profile editing
  cancelEdit() {
    this.showEditProfile = false;
  }

  // Opens the profile edit dialog
  openEditProfile(profile: any) {
    this.editedProfile = { ...profile };
    this.showEditProfile = true;
    this.profileToDelete = profile;
  }
}