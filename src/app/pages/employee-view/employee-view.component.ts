import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-view.component.html'
})
export class EmployeeViewComponent {
  employee: any;
  loading = true;
  error: any;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    const id = this.route.snapshot.paramMap.get('id');
    this.apollo.watchQuery<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.employee = data.searchEmployeeByEid;
        this.loading = loading;
      },
      error: (err) => {
        this.error = err;
        console.error('Error loading employee:', err);
      }
    });
  }
}
