import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      const LOGIN_QUERY = gql`
        query Login($email: String, $username: String, $password: String!) {
          login(email: $email, username: $username, password: $password) {
            token
            user {
              id
              email
              username
            }
          }
        }
      `;

      this.apollo.query({
        query: LOGIN_QUERY,
        variables: {
          email,
          username: null, // required by backend schema
          password
        },
        fetchPolicy: 'no-cache' // Optional: ensures fresh response
      }).subscribe({
        next: ({ data }: any) => {
          const token = data?.login?.token;
          if (token) {
            this.authService.setToken(token);
            this.router.navigate(['/employees']);
          } else {
            this.loginError = 'Invalid login. Please try again.';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.loginError = 'Invalid email or password.';
        }
      });
    }
  }
}
