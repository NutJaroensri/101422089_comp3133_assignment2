import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';
import { RouterModule } from '@angular/router';

export const GET_EMPLOYEES = gql`
  query {
    getAllEmployees {
      id
      first_name
      last_name
      email
      designation
      department
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent {
  employees: any[] = [];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEES
    }).valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.employees = data.getAllEmployees; // ✅ FIXED: use correct query name
        this.loading = loading;
      },
      error: (err) => {
        this.error = err;
        console.error('GraphQL error:', err);
      }
    });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id }
      }).subscribe({
        next: () => {
          alert('Employee deleted!');
          this.employees = this.employees.filter(e => e.id !== id);
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Failed to delete employee.');
        }
      });
    }
  }
}
