import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-test.component.html',
  styleUrls: ['./login-test.component.css']
})
export class LoginTestComponent {
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
        next: (response) => {
          alert('Login successful');
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


