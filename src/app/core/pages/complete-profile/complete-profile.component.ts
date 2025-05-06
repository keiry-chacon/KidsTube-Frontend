import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user.service';
import { CountryService } from '../../services/country.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ageValidator } from '../../../Validators/age.validator'; 
import { phoneNumberValidator } from '../../../Validators/phone-number.validator'; 
import { pinValidator } from '../../../Validators/pin.validator'; 
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css',
  animations: [
    trigger('slideIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%)' // Starts off-screen to the right
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateX(0)' // Returns to original position
      })),
      transition('void => *', animate('0.6s ease')) // Animation duration and easing
    ])
  ]
})
export class CompleteProfileComponent {
  informationForm: FormGroup;
  countries: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private countryService: CountryService,
    private router: Router
  ) {
    // Initializes the form with validation rules
    this.informationForm = this.fb.group({
      dateOfBirth: ['', [Validators.required, ageValidator]],       // Custom validator to check age
      phoneNumber: ['', [phoneNumberValidator]],                    // Custom validator to check phone format
      country: ['', Validators.required],                           // Required field
      pin: ['', [pinValidator]]                                     // Custom validator to validate pin
    });
  }

  ngOnInit(): void {
    // Loads country list from the backend
    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  // Submits the form data to update the user profile
  onSubmit(): void {
    if (this.informationForm.valid) {
      const formData = {
        ...this.informationForm.value,
        status: 'active' // Adds status to the form data
      };

      this.userService.updateProfile(formData).subscribe({
        next: (response) => {
          alert('Profile information complete!');
          this.router.navigate(['/profiles']); // Redirects to profiles page
        },
        error: (err) => {
          // Displays backend-specific validation errors if available
          const errorMessage = err.error?.errors?.join('\n') || 
                               err.error?.message || 
                               'Error registering. Please check your data.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }
}
