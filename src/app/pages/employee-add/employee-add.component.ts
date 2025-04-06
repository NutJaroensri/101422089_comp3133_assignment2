import { gql } from 'apollo-angular';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $gender: String!,
    $designation: String!,
    $salary: Float!,
    $date_of_joining: String!,
    $department: String!,
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      gender: $gender,
      designation: $designation,
      salary: $salary,
      date_of_joining: $date_of_joining,
      department: $department,
      employee_photo: $employee_photo
    ) {
      id
      first_name
    }
  }
`;

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [1000, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: this.employeeForm.value
      }).subscribe({
        next: () => {
          alert('Employee added successfully!');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Add employee error', err);
          alert('Something went wrong!');
        }
      });
    }
  }
}
