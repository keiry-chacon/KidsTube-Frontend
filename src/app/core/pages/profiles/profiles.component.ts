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
          this.profiles = this.profiles.filter(p => p._id !== this.profileToDelete._id);
          this.showConfirmDelete = false;
        },
        error: (err: any) => {
        }
      });
    }
  }

  // Selects a profile for deletion
  selectProfileToDelete(profile: any) {
    this.profileToDelete = profile;
  }

  // Selects an image for the profile
  selectImage(img: string) {
    this.editedProfile.avatar = img;
    this.dropdownOpen = false;
  }

  // Loads all profiles
  loadProfiles() {
    this.profileService.getProfilesGraph().subscribe({
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
      }
    });
  }

  // Navigates to the settings page
  goToSettings() {
    this.openUserPinDialog();
  }

  // Navigates to the manage profiles page
  ManageProfiles() {
    this.router.navigate(['/list-profile']);
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
    this.postValidationAction = false;
  }

  // Selects a profile
  selectProfile(profile: any) {
    if (!this.showManageProfiles) {
      this.selectedProfile = profile;
      this.openProfilePinDialog();
    } else {
      console.warn('Cannot select a profile while managing profiles.');
    }
  }

  // Opens the profile PIN dialog
  openProfilePinDialog() {
    this.showPinDialog = true;
    this.enteredPin = '';
    this.pinError = false;
  }

  // Validates the user PIN
  validateUserPin(): void {
    const pinToValidate = this.enteredUserPin.trim();

    if (!pinToValidate) {
      this.userPinError = true;
      return;
    }

    if (pinToValidate.length < 4) {
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

  // Validates the profile PIN
  validateProfilePin(): void {
    const pinToValidate = this.enteredPin;
    if (!this.selectedProfile) {
      return;
    }
    this.profileService.validatePin(this.selectedProfile._id, pinToValidate).subscribe({
      next: (response) => {
        if (response.profile) {
          this.closePinDialog();
          localStorage.setItem('currentProfileId', this.selectedProfile._id);
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
    ];

    this.predefinedImages = imageNames.map(name => `.../../../../assets/profiles/${name}`);
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

  // Adds a new profile (placeholder)
  addProfile() {
  }

  // Opens the profile edit dialog
  openEditProfile(profile: any) {
    this.editedProfile = { ...profile };
    this.showEditProfile = true;
  }

  // Calculates the total number of pages
  calculatePages() {
    this.totalPages = Math.ceil(this.profiles.length / this.profilesPerPage);
    this.updateVisibleProfiles();
  }

  // Updates the visible profiles based on the current page
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