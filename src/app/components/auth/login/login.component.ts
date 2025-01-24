import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { HttpService } from "../../../../services/http.service";
import { UserService } from "../../../../services/user.service";
import { globals } from "../../../../globals";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { Message } from "primeng/message";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ButtonModule,
		InputTextModule,
		PasswordModule,
		Message,
	],
	providers: [HttpService],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	globals = globals;
	email: string = "";
	password: string = "";
	rememberMe: boolean = false;
	message: string = "";
	loading: boolean = false;

	severity: string = "error";

	httpService = inject(HttpService);
	userService = inject(UserService);
	router = inject(Router);

	login() {
		const body = {
			user: {
				email: this.email.trim(),
				password: this.password.trim(),
			},
		};
		this.loading = true;
		this.httpService
			.postRequest<LoginRespone>(this.globals.urls.auth.login, body)
			.subscribe({
				next: (response: LoginRespone) => {
					this.message = response.message;
					this.loading = false;
					const userData = response.user;
					localStorage.setItem("user-data", JSON.stringify(userData));
					localStorage.setItem("jwtToken", response.token);
					this.userService.loadUserData();
					this.router.navigate(["/dashboard"]);
				},
				error: (error) => {
					this.message = error.message;
					this.severity = "error";
					this.loading = false;
				},
			});
	}
}

interface LoginRespone {
	message: string;
	user: {
		id: number;
		email: string;
		role: "teacher" | "student" | "super_admin";
		first_name: string;
		middle_name: string;
		last_name: string;
		account_status: "active" | "inactive";
		created_at: string;
		updated_at: string;
	};
	token: string;
}
