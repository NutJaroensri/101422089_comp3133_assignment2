import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeAddComponent } from './pages/employee-add/employee-add.component';
import { EmployeeViewComponent } from './pages/employee-view/employee-view.component';
import { EmployeeUpdateComponent } from './pages/employee-update/employee-update.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'employees', component: EmployeeListComponent },
    { path: 'employees/add', component: EmployeeAddComponent },
    { path: 'employees/view/:id', component: EmployeeViewComponent },
    { path: 'employees/update/:id', component: EmployeeUpdateComponent }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
