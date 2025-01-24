import { Routes } from '@angular/router';

import { loginGuard } from "../guards/login.guard";
import { authGuard } from "../guards/auth.guard";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "dashboard",
		pathMatch: "full",
	},
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
				data: { breadcrumbs: ["dashboard"] },
			},
			{
				title: "Registrations",
				path: "registrations",
				loadComponent: () =>
					import("./components/registrations.component").then(
						(c) => c.RegistrationsComponent
					),
				canActivate: [() => authGuard()],
				data: { breadcrumbs: ["dashboard", "registrations"] },
			},
			{
				title: "Invitations",
				path: "invitations",
				loadComponent: () =>
					import("./components/invitations/list/list.component").then(
						(c) => c.ListComponent
					),
				canActivate: [() => authGuard()],
				data: { breadcrumbs: ["dashboard", "invitations"] },
			},
			{
				title: "Invite Users",
				path: "invitations/new",
				loadComponent: () =>
					import(
						"./components/invitations/invite/invite.component"
					).then((c) => c.InviteComponent),
				canActivate: [() => authGuard()],
				data: { breadcrumbs: ["dashboard", "invitations", "new"] },
			},
			{
				title: "Classrooms",
				path: "classrooms",
				loadComponent: () =>
					import("./components/classrooms/list/list.component").then(
						(c) => c.ListComponent
					),
				canActivate: [() => authGuard()],
				data: { breadcrumbs: ["dashboard", "classrooms"] },
			},
			{
				title: "Add Classroom",
				path: "classrooms/add",
				loadComponent: () =>
					import("./components/classrooms/add/add.component").then(
						(c) => c.AddComponent
					),
				canActivate: [() => authGuard()],
				data: { breadcrumbs: ["dashboard", "classrooms", "add"] },
			},
			{
				title: "Update Classroom",
				path: "classrooms/:id/update",
				loadComponent: () =>
					import(
						"./components/classrooms/update/update.component"
					).then((c) => c.UpdateComponent),
				canActivate: [() => authGuard()],
				data: { breadcrumbs: ["dashboard", "classrooms", "edit"] },
			},
			{
				title: "View Classroom",
				path: "classrooms/:id/view",
				loadComponent: () =>
					import("./components/classrooms/view/view.component").then(
						(c) => c.ViewComponent
					),
				data: { breadcrumbs: ["dashboard", "classrooms", "view"] },
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
		title: "Unlock Instructions",
		path: "auth/unlock",
		loadComponent: () =>
			import(
				"./components/auth/unlock-instructions/unlock-instructions.component"
			).then((c) => c.UnlockInstructionsComponent),
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
		title: "Accept Invitation",
		path: "invitations/accept",
		loadComponent: () =>
			import("./components/invitations/accept/accept.component").then(
				(c) => c.AcceptComponent
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
