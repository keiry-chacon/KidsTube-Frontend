import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account-validation',
  imports: [NgIf],
  templateUrl: './account-validation.component.html',
  styleUrl: './account-validation.component.css'
})
export class AccountValidationComponent implements OnInit {
  message = 'Verifying your account...';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    
    if (!token) {
      this.message = 'Invalid verification link.';
      return;
    }

    this.userService.verifyAccount(token).subscribe({
      next: () => {
        this.message = 'Your account has been successfully verified!';
        this.isSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.message = err.error?.error || 'Error verifying your account.';
      }
    });
  }
}
