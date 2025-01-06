import { Routes } from '@angular/router';

import { LoginGuard } from "../guards/login.guard";
import { AuthGuard } from "../guards/auth.guard";

import { LoginComponent } from "./components/auth/login/login.component";
import { SignupComponent } from "./components/auth/signup/signup.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from "./components/notfound.component";

export const routes: Routes = [
	{
		path: "",
		component: AppLayoutComponent,
		children: [
			{
				title: "Dashboard",
				path: "",
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
	{
		title: "Not Found",
		path: "not-found",
		component: NotfoundComponent,
	},
	{
		path: "**",
		redirectTo: "/not-found",
	},
];
