import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account-validation',
  standalone: true,
  imports: [NgIf],
  templateUrl: './account-validation.component.html',
  styleUrls: ['./account-validation.component.css']
})
export class AccountValidationComponent implements OnInit {
  // Default message displayed while verifying the account
  message = 'Verifying your account...';
  // Flag to indicate if the verification was successful
  isSuccess = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Extract the verification token from the URL
    const token = this.route.snapshot.paramMap.get('token');

    // If no token is found, display an error message
    if (!token) {
      this.message = 'Invalid verification link.';
      return;
    }

    // Call the service to verify the account using the token
    this.userService.verifyAccount(token).subscribe({
      next: () => {
        // Update the message and set success flag on successful verification
        this.message = 'Your account has been successfully verified!';
        this.isSuccess = true;

        // Redirect to the login page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        // Display an error message if verification fails
        this.message = err.error?.error || 'Error verifying your account.';
      }
    });
  }
}