import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ageValidator } from '../../../Validators/age.validator'; 
import { phoneNumberValidator } from '../../../Validators/phone-number.validator'; 
import { pinValidator } from '../../../Validators/pin.validator'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent  {
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

  onSubmit() {
    if (this.signUpForm.valid) {
      const formData = { ...this.signUpForm.value, status: 'active' };
      console.log('Sending data:', formData);  
  
      this.userService.signup(formData).subscribe({
        next: (response) => {
          alert('Registration successful');
          // You can redirect the user to another page or do something else with the response
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
