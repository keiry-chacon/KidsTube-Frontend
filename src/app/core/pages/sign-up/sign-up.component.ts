import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
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

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, ageValidator]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [phoneNumberValidator]],
      country: [''],
      password: ['', Validators.required],
      pin: ['', [pinValidator]],
    });
  }

  // Handles form submission to register a new user
  onSubmit() {
    if (this.signUpForm.valid) {
      const formData = { ...this.signUpForm.value, status: 'active' };

      this.userService.signup(formData).subscribe({
        next: (response) => {
          alert('Registration successful');
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Error registering. Please try again later.';
          alert(errorMessage);
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }
}