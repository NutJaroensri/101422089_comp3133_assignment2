import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  

  onSubmit() {
    if (this.loginForm.valid) {
      // 🔁 This will be replaced with GraphQL login later
      const mockToken = 'mock-jwt-token-123';
      this.authService.setToken(mockToken);

      console.log('Login successful. Token saved:', mockToken);
      // Optional: redirect to employee list
      // this.router.navigate(['/employees']);
    }
  }
}
