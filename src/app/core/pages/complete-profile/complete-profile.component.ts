import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CountryService } from '../../services/country.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa Router

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
        transform: 'translateX(0)' // Ends in its original position
      })),
      transition('void => *', animate('0.6s ease')) // Duration and easing for the animation
    ])
  ]
})
export class CompleteProfileComponent {
  informationForm: FormGroup;
  countries: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private authenticationService: AuthenticationService,
    private authService: AuthService,
    private userService: UserService, 
    private countryService: CountryService,
    private router: Router // Inyecta Router
  ) {
    this.informationForm = this.fb.group({
      dateOfBirth: ['', [Validators.required, ageValidator]],
      phoneNumber: ['', [phoneNumberValidator]],
      country: ['', Validators.required],
      pin: ['', [pinValidator]],
    });
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data; 
    });
  }

  // Handles form submission to complete personal information
  onSubmit() {
    if (this.informationForm.valid) {
      const formData = { ...this.informationForm.value, status: 'active' };

      this.userService.updateProfile(formData).subscribe({
        next: (response) => {
          alert('Profile information complete!');
          this.router.navigate(['/profiles']); // Redirecciona a login
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