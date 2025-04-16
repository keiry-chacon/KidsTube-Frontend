import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user.service';
import { CountryService } from '../../services/country.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ageValidator } from '../../../Validators/age.validator'; 
import { phoneNumberValidator } from '../../../Validators/phone-number.validator'; 
import { pinValidator } from '../../../Validators/pin.validator'; 
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  animations: [
    trigger('slideIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%)' // Starts off-screen to the right
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateX(0)' // Ends in its original position
      })),
      transition('void => *', animate('0.6s ease')) // Duration and easing for the animation
    ])
  ]
})
export class SignUpComponent {
  signUpForm: FormGroup;
  countries: string[] = [];

  constructor(private fb: FormBuilder, 
    private authService: AuthenticationService,
    private userService: UserService, 
    private countryService: CountryService
  ) {
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

  ngOnInit(): void {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data; 
    });
  }

  signInWithGoogle() {
    this.authService.googleSignUpOrLogin()
      .catch(error => console.error('Google Sign-Up Error:', error));
  }

  // Handles form submission to register a new user
  onSubmit() {
    if (this.signUpForm.valid) {
      const formData = { ...this.signUpForm.value, status: 'pending' };

      this.userService.signup(formData).subscribe({
        next: (response) => {
          alert('Registration successful! Please check your email to verify your account.');
        },
        error: (err) => {
          // Muestra los errores específicos del backend
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