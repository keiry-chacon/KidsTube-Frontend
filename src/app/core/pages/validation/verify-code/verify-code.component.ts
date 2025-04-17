import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
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
export class VerifyCodeComponent {
  codeForm: FormGroup;
  errorMessage: string = '';
  tempToken: string | null = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]] // Ensures exactly 6 digits
    });

    this.tempToken = sessionStorage.getItem('tempUserId');
    if (!this.tempToken) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.codeForm.valid && this.tempToken) {
      const code = this.codeForm.value.code;
      this.userService.verify2FACode(this.tempToken, code).subscribe({
        next: (response) => {
          sessionStorage.setItem('token', response.token);
          sessionStorage.removeItem('tempUserId');
          this.router.navigate(['/profiles']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Código incorrecto o expirado.';
        },
      });      
    }
  }

  // Prevent more than 6 digits from being entered
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
  
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
  
    this.codeForm.get('code')?.setValue(value, { emitEvent: false });
  }  
}
