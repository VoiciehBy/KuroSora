import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

const routes: Routes = [
  { path: "", redirectTo: "/", pathMatch: "full" },
  { path: "login-dialog", component: LoginDialogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
