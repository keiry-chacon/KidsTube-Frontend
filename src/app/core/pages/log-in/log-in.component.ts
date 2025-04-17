import { Component } from '@angular/core';
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
  logInForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    
  }

  onSubmit() {
    if (this.logInForm.valid) {
      const formData = this.logInForm.value;
      console.log('Sending data:', formData);
  
      this.userService.login(formData).subscribe({
        next: () => {
          this.router.navigate(['/verify-code']);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Error logging in. Please try again later.';
          alert(this.errorMessage);
        }
      });
    } else {
      alert('Form is invalid. Please check the fields.');
    }
  }
  
  

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}


