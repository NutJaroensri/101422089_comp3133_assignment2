import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GET_EMPLOYEES } from '../employee-list/employee-list.component';


const GET_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeByEid($id: ID!) {
    searchEmployeeByEid(id: $id) {
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!,
    $first_name: String,
    $last_name: String,
    $email: String,
    $gender: String,
    $designation: String,
    $salary: Float,
    $date_of_joining: String,
    $department: String,
    $employee_photo: String
  ) {
    updateEmployee(
      id: $id,
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
    }
  }
`;

@Component({
  selector: 'app-employee-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-update.component.html'
})
export class EmployeeUpdateComponent {
  employeeForm: FormGroup;
  id: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
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

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.apollo.watchQuery<any>({
        query: GET_EMPLOYEE_BY_ID,
        variables: { id: this.id },
        fetchPolicy: 'network-only'
      }).valueChanges.subscribe(({ data }) => {
        this.employeeForm.patchValue(data.searchEmployeeByEid);
        this.loading = false;
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid && this.id) {
      this.apollo.mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id: this.id,
          ...this.employeeForm.value
        },
        refetchQueries: [
          {
            query: GET_EMPLOYEES
          }
        ]

      }).subscribe({
        next: () => {
          alert('Employee updated!');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update employee.');
        }
      });
    }
  }
}
