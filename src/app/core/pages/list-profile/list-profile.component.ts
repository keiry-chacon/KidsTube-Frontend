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
    this.loadProfiles(); // Loads all profiles when the component initializes
    this.loadPredefinedImages(); // Loads predefined images for profile avatars
    this.openUserPinDialog(); // Opens the PIN dialog to manage profiles
  }

  // Opens the dialog to add a new profile
  openAddProfileDialog() {
    this.newProfile = {
      fullName: '',
      pin: '',
      avatar: this.predefinedImages[0]?.fullPath || '', // Default avatar if none is selected
      avatarName: this.getFileNameWithoutExtension(this.predefinedImages[0]?.fileName) || 'Select avatar', // Default avatar name
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

  // Selects a new profile image and sets the avatar for the new profile
  selectNewProfileImage(fullPath: string) {
    const fileName = fullPath.split('/').pop() || 'Select avatar'; // Extracts the file name

    this.newProfile.avatar = fullPath; // Sets the avatar for the new profile
    this.newProfile.avatarName = fileName; // Sets the avatar name
    this.dropdownOpen = false; // Closes the dropdown menu
  }

  // Extracts the file name without its extension
  getFileNameWithoutExtension(filePath: string): string {
    if (!filePath) return ''; // If filePath is null or empty, returns an empty string

    const fileName = filePath.split('/').pop(); // Extracts the file name
    if (!fileName) return ''; // If fileName is undefined, returns an empty string

    return fileName.split('.').slice(0, -1).join('.'); // Removes the file extension
  }

  // Saves the new profile to the service and reloads the profiles
  saveNewProfile() {
    const avatarName = this.newProfile.avatar.split('/').pop(); // Extracts the file name for avatar
    this.newProfile.avatar = avatarName; // Updates avatar name
    this.profileService.createProfile(this.newProfile).subscribe({
      next: (response) => {
        this.loadProfiles(); 
        this.closeAddProfileDialog();
      },
      error: (err) => {
      }
    });
  }

  // Toggles the visibility of the dropdown menu
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Shows the confirmation dialog for deleting a profile
  confirmDelete() {
    this.showConfirmDelete = true;
  }

  // Cancels the profile deletion
  cancelDelete() {
    this.showConfirmDelete = false;
  }

  // Deletes a profile by sending the request to the service
  deleteProfile() {
    if (this.profileToDelete) {
      this.profileService.deleteProfile(this.profileToDelete._id).subscribe({
        next: () => {
          alert('Profile deleted successfully.'); // Alerts when deletion is successful
          this.profiles = this.profiles.filter(p => p._id !== this.profileToDelete._id); // Removes deleted profile from the list
          this.cancelDelete(); // Closes the delete confirmation dialog
        },
        error: (err) => {
          alert('Error deleting profile. Please try again.'); // Alerts on error
        },
      });
    }
  }

  // Selects a profile for deletion
  selectProfileToDelete(profile: any) {
    this.profileToDelete = profile;
  }

  // Selects an image for the profile and updates avatar information
  selectImage(fullPath: string) {
    const fileName = fullPath.split('/').pop() || 'Select avatar';

    this.editedProfile.avatar = fullPath;
    this.editedProfile.avatarName = fileName;

    this.dropdownOpen = false; // Closes the dropdown menu
  }

  // Loads all profiles from the service
  loadProfiles() {
    this.profileService.getProfiles().subscribe({
      next: (response: { data: any[] }) => {
        this.profiles = response.data.map(profile => {
          return {
            ...profile,
            avatar: `../../../assets/profiles/${profile.avatar}` // Constructs the full avatar path
          };
        });
      },
      error: (err: any) => {
        // Handle error if any
      }
    });
  }

  // Opens the PIN dialog for managing profiles
  openPinDialogForManageProfiles() {
    this.openUserPinDialog();
  }

  // Opens the user PIN dialog for validation
  openUserPinDialog() {
    this.showUserPinDialog = true;
    this.enteredUserPin = '';
    this.userPinError = false;
  }

  // Closes the user PIN dialog
  closeUserPinDialog() {
    this.showUserPinDialog = false;
  }

  // Validates the user PIN and proceeds with profile management
  validateUserPin(): void {
    const pinToValidate = this.enteredUserPin;

    if (!pinToValidate) {
      this.userPinError = true; // Sets error if no PIN is entered
      return;
    }

    this.userService.validateUserPin(pinToValidate).subscribe({
      next: (response) => {
        if (response.user) {
          this.closeUserPinDialog(); // Closes the dialog if PIN is valid
          this.showManageProfiles = true; // Shows the profile management view
        } else {
          this.userPinError = true; // Sets error if PIN is invalid
        }
      },
      error: (err) => {
        this.userPinError = true; // Sets error on failure
      }
    });
  }

  // Closes the PIN dialog
  closePinDialog() {
    this.showPinDialog = false;
  }

  // Starts the profile editing process
  editProfile(profile: any) {
    if (!this.showManageProfiles) {
      this.editedProfile = { ...profile }; // Clones the profile to edit
      this.showEditProfile = true; // Opens the edit profile view
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
      fullPath: `../../../assets/profiles/${name}`, // Full path of the image
      fileName: name, // File name
    }));
  }

  // Saves the edited profile to the service
  saveProfile() {
    const avatarName = this.editedProfile.avatar.split('/').pop(); // Extracts avatar file name
    this.editedProfile.avatar = avatarName; // Updates the avatar name
    this.profileService.updateProfile(this.editedProfile).subscribe({
      next: (response) => {
        const index = this.profiles.findIndex(p => p._id === this.editedProfile._id);
        if (index !== -1) {
          this.editedProfile.avatar = `../../../../assets/profiles/${avatarName}`; // Updates avatar path
          this.profiles[index] = { ...this.editedProfile }; // Updates the profile in the list
        }
        this.showEditProfile = false; 
      },
      error: (err) => {
      }
    });
  }

  // Cancels the profile editing process
  cancelEdit() {
    this.showEditProfile = false;
  }

  // Opens the profile edit dialog with the selected profile
  openEditProfile(profile: any) {
    this.editedProfile = { ...profile };
    this.showEditProfile = true; 
    this.profileToDelete = profile; 
  }
}
