import { Routes } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

export const routes: Routes = [
	{ title: "Login", path: "auth/login", component: LoginComponent },
	{ title: "Signup", path: "auth/signup", component: SignupComponent },
];
