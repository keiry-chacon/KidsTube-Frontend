import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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

  // --- UI Interaction Methods --- //

  // Toggles the dropdown for avatar selection
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Opens the confirmation dialog for profile deletion
  confirmDelete() {
    this.showConfirmDelete = true;
  }

  // Closes the confirmation dialog without deleting
  cancelDelete() {
    this.showConfirmDelete = false;
  }

  // Opens the PIN validation dialog for a profile
  openProfilePinDialog() {
    this.showPinDialog = true;
    this.enteredPin = '';
    this.pinError = false;
  }

  // Closes the PIN validation dialog
  closePinDialog() {
    this.showPinDialog = false;
  }

  // Opens the user PIN validation dialog
  openUserPinDialog() {
    this.showUserPinDialog = true;
    this.enteredUserPin = '';
    this.userPinError = false;
  }

  // Closes the user PIN validation dialog
  closeUserPinDialog() {
    this.showUserPinDialog = false;
    this.postValidationAction = false;
  }

  // Opens the edit dialog for a profile
  openEditProfile(profile: any) {
    this.editedProfile = { ...profile };
    this.showEditProfile = true;
  }

  // Cancels profile editing and closes the dialog
  cancelEdit() {
    this.showEditProfile = false;
  }

  // --- Profile Selection & Navigation --- //

  // Selects a profile for viewing (with PIN validation)
  selectProfile(profile: any) {
    if (!this.showManageProfiles) {
      this.selectedProfile = profile;
      this.openProfilePinDialog();
    } else {
      console.warn('Cannot select a profile while managing profiles.');
    }
  }

  // Navigates to the settings page after PIN validation
  goToSettings() {
    this.openUserPinDialog();
  }

  // Navigates to the profile management page
  manageProfiles() {
    this.router.navigate(['/list-profile']);
  }

  // --- Profile CRUD Operations --- //

  // Loads all profiles from the server
  loadProfiles() {
    this.profileService.getProfilesGraph().subscribe({
      next: (response: any) => {  
        if (!response || !Array.isArray(response)) {
          console.error('Invalid data received:', response);
          return;
        }
        this.profiles = response.map(profile => ({
          ...profile,
          id: profile.id,
          avatar: profile.avatar.includes('assets') 
            ? profile.avatar 
            : `../../../assets/profiles/${profile.avatar}`,
        }));
        this.calculatePages();
      },
      error: (err: any) => {
        console.error('Error loading profiles:', err);
        alert('Failed to load profiles. Please try again.');
      }
    });
  }

  // Deletes the selected profile after confirmation
  deleteProfile() {
    if (this.profileToDelete) {
      this.profileService.deleteProfile(this.profileToDelete._id).subscribe({
        next: () => {
          this.profiles = this.profiles.filter(p => p._id !== this.profileToDelete._id);
          this.showConfirmDelete = false;
          this.calculatePages(); // Recalculate pagination
        },
        error: (err: any) => {
          console.error('Error deleting profile:', err);
        }
      });
    }
  }

  // Saves the edited profile to the server
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
        console.error('Error updating profile:', err);
      }
    });
  }

  // --- PIN Validation --- //

  // Validates the entered profile PIN
  validateProfilePin(): void {
    const pinToValidate = this.enteredPin;
    if (!this.selectedProfile) return;

    this.profileService.validatePin(this.selectedProfile.id, pinToValidate).subscribe({
      next: (response) => {
        if (response.profile) {
          this.closePinDialog();
          localStorage.setItem('currentProfileId', this.selectedProfile.id);
          this.router.navigate(['/child-screen']);
        } else {
          this.pinError = true;
        }
      },
      error: (err) => {
        this.pinError = true;
      }
    });
  }

  // Validates the user's master PIN
  validateUserPin(): void {
    const pinToValidate = this.enteredUserPin.trim();

    if (!pinToValidate || pinToValidate.length < 4) {
      this.userPinError = true;
      return;
    }

    this.userService.validateUserPin(pinToValidate).subscribe({
      next: (response) => {
        if (response.user) {
          this.closeUserPinDialog();
          this.router.navigate(['/videoList']);
        } else {
          this.userPinError = true;
        }
      },
      error: (err) => {
        this.userPinError = true;
      }
    });
  }

  // --- Avatar Management --- //

  // Loads predefined avatar images
  loadPredefinedImages() {
    const imageNames = ['rapunzel.png', 'cocomelon.jpg', 'gato.png'];
    this.predefinedImages = imageNames.map(name => `.../../../../assets/profiles/${name}`);
  }

  // Selects an avatar image for the edited profile
  selectImage(img: string) {
    this.editedProfile.avatar = img;
    this.dropdownOpen = false;
  }

  // --- Pagination --- //

  // Calculates total pages and updates visible profiles
  calculatePages() {
    this.totalPages = Math.ceil(this.profiles.length / this.profilesPerPage);
    this.updateVisibleProfiles();
  }

  // Updates the list of visible profiles based on current page
  updateVisibleProfiles() {
    const start = this.currentPage * this.profilesPerPage;
    const end = start + this.profilesPerPage;
    this.visibleProfiles = this.profiles.slice(start, end);
  }

  // Navigates to the previous page
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateVisibleProfiles();
    }
  }

  // Navigates to the next page
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateVisibleProfiles();
    }
  }
}