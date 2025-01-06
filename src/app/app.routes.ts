import { Routes } from '@angular/router';

import { LoginGuard } from "../guards/login.guard";
import { AuthGuard } from "../guards/auth.guard";

import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppLayoutComponent } from "./layout/app.layout.component";

export const routes: Routes = [
	{
		path: "",
		component: AppLayoutComponent,
		children: [
			{
				title: "Dashboard",
				path: "dashboard",
				component: DashboardComponent,
				// canActivate: [AuthGuard],
			},
		],
	},
	{
		title: "Login",
		path: "auth/login",
		component: LoginComponent,
		// canActivate: [LoginGuard],
	},
	{
		title: "Signup",
		path: "auth/signup",
		component: SignupComponent,
		// canActivate: [LoginGuard],
	},
];
