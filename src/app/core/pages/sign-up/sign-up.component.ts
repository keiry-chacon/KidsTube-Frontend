import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user.service';
import { CountryService } from '../../services/country.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Custom validators
import { ageValidator } from '../../../Validators/age.validator'; 
import { phoneNumberValidator } from '../../../Validators/phone-number.validator'; 
import { pinValidator } from '../../../Validators/pin.validator'; 

// Angular animations for UI effects
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  animations: [
    // Animation for sliding elements into view
    trigger('slideIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%)' // Starts off-screen to the right
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateX(0)' // Ends in its original position
      })),
      transition('void => *', animate('0.6s ease')) // Smooth animation over 0.6 seconds
    ])
  ]
})
export class SignUpComponent {
  signUpForm: FormGroup; // Form group for registration
  countries: string[] = []; // List of available countries

  constructor(
    private fb: FormBuilder, 
    private authenticationService: AuthenticationService,
    private userService: UserService, 
    private countryService: CountryService
  ) {
    // Initialize the form with required fields and validators
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, ageValidator]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [phoneNumberValidator]],
      country: ['', Validators.required],
      password: ['', Validators.required],
      pin: ['', [pinValidator]],
    });
  }

  // Fetch countries on component initialization
  ngOnInit(): void {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data; // Populate the countries list
    });
  }

  // Handle Google sign-up
  signInWithGoogle() {
    this.authenticationService.googleSignUp().subscribe({
      next: () => {
        // Handle successful Google sign-up
      },
      error: (err) => {
        console.error('Google Sign-Up Error:', err); // Log errors
      }
    });
  }

  // Handle form submission for user registration
  onSubmit() {
    if (this.signUpForm.valid) {
      const formData = { ...this.signUpForm.value, status: 'pending' }; // Add status to form data

      this.userService.signup(formData).subscribe({
        next: (response) => {
          alert('Registration successful! Please check your email to verify your account.');
        },
        error: (err) => {
          // Display specific backend errors or a generic message
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