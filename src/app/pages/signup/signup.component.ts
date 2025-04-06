import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  signupForm: FormGroup;
  signupSuccess = false;
  signupError = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;

      this.apollo.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password }
      }).subscribe({
        next: ({ data }: any) => {
          if (data?.signup?.token) {
            this.signupSuccess = true;
            alert('Signup successful! You can now log in.');
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          this.signupError = 'Signup failed. Please try again.';
        }
      });
    }
  }
}
