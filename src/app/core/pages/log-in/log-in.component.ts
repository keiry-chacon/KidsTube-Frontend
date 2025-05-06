import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  animations: [
    // Animation to slide in the login form from the right
    trigger('slideIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%)'  
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateX(0)' 
      })),
      transition('void => *', animate('0.6s ease'))  
    ])
  ]
})
export class LogInComponent {
  logInForm: FormGroup; // Reactive form group for login
  errorMessage: string = ''; // To store any login error message

  constructor(
    private fb: FormBuilder, 
    private authenticationService: AuthenticationService, 
    private userService: UserService,  
    private router: Router) { 
    // Initialize the login form with validation
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email field with required and email format validation
      password: ['', Validators.required],  // Password field with required validation
    });
  }

  // Handles form submission
  onSubmit() {
    // Check if the form is valid
    if (this.logInForm.valid) {
      const formData = this.logInForm.value;  // Get the form data
      console.log('Sending data:', formData);  // Log the form data for debugging purposes
  
      // Call the login API method
      this.userService.login(formData).subscribe({
        next: () => {
          // Navigate to the verification page on successful login
          this.router.navigate(['/verify-code']);
        },
        error: (err) => {
          // Handle error if login fails
          this.errorMessage = err?.error?.message || 'Error logging in. Please try again later.'; // Default error message
          alert(this.errorMessage); // Show error message to the user
        }
      });
    } else {
      // Show error if the form is invalid
      alert('Form is invalid. Please check the fields.');
    }
  }

  // Handles Google sign-in
  signInWithGoogle() {
    // Calls the Google login method from authentication service
    this.authenticationService.googleLogin().subscribe({
      next: () => {
        // Google login success; internally navigates to the next step depending on profile completeness
      },
      error: (err) => {
        // Handle error if Google login fails
        console.error('Google Login Error:', err);  // Log the error for debugging
        alert('Error during Google login. Try again.');  // Show error to the user
      }
    });
  }

  // Navigates to the sign-up page
  goToSignUp() {
    this.router.navigate(['/signup']);  // Navigate to the sign-up page
  }
}
