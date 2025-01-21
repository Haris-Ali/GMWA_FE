import { Routes } from '@angular/router';

import { loginGuard } from "../guards/login.guard";
import { authGuard } from "../guards/auth.guard";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./layout/app.layout.component").then(
				(c) => c.AppLayoutComponent
			),
		children: [
			{
				title: "Dashboard",
				path: "dashboard",
				loadComponent: () =>
					import("./components/dashboard/dashboard.component").then(
						(c) => c.DashboardComponent
					),
				canActivate: [() => authGuard()],
			},
		],
	},
	{
		title: "Login",
		path: "auth/login",
		loadComponent: () =>
			import("./components/auth/login/login.component").then(
				(c) => c.LoginComponent
			),
		canActivate: [() => loginGuard()],
	},
	{
		title: "Signup",
		path: "auth/signup",
		loadComponent: () =>
			import("./components/auth/signup/signup.component").then(
				(c) => c.SignupComponent
			),
		canActivate: [() => loginGuard()],
	},
	{
		title: "Forgot Password",
		path: "auth/forgot-password",
		loadComponent: () =>
			import(
				"./components/auth/forgot-password/forgot-password.component"
			).then((c) => c.ForgotPasswordComponent),
		canActivate: [() => loginGuard()],
	},
	{
		title: "Reset Password",
		path: "auth/reset-password",
		loadComponent: () =>
			import(
				"./components/auth/reset-password/reset-password.component"
			).then((c) => c.ResetPasswordComponent),
		canActivate: [() => loginGuard()],
	},
	{
		title: "Confirmation Instructions",
		path: "auth/confirmation",
		loadComponent: () =>
			import(
				"./components/auth/confirmation-instructions/confirmation-instructions.component"
			).then((c) => c.ConfirmationInstructionsComponent),
		canActivate: [() => loginGuard()],
	},
	{
		title: "Confirmation",
		path: "auth/confirmation-email",
		loadComponent: () =>
			import(
				"./components/auth/confirmation/confirmation.component"
			).then((c) => c.ConfirmationComponent),
		canActivate: [() => loginGuard()],
	},
	{
		title: "Unlock",
		path: "auth/unlock-email",
		loadComponent: () =>
			import("./components/auth/unlock/unlock.component").then(
				(c) => c.UnlockComponent
			),
		canActivate: [() => loginGuard()],
	},
	{
		title: "Not Found",
		path: "not-found",
		loadComponent: () =>
			import("./components/notfound.component").then(
				(c) => c.NotfoundComponent
			),
	},
	{
		path: "**",
		redirectTo: "/not-found",
	},
];
