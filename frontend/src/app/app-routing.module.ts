import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ActivationComponent } from './activation/activation.component';
import { PassRecoveryComponent } from './pass-recovery/pass-recovery.component';
import { PassRecovery1Component } from './pass-recovery1/pass-recovery1.component';
import { PassRecovery2Component } from './pass-recovery2/pass-recovery2.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "password_recovery", component: PassRecoveryComponent },
  { path: "password_recovery_1", component: PassRecovery1Component },
  { path: "password_recovery_2", component: PassRecovery2Component },
  { path: "activate", component: ActivationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
