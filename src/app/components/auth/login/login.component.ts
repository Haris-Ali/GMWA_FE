import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { Message } from "primeng/message";
import { Checkbox } from "primeng/checkbox";
import { UserService } from "../../../../services/user.service";

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
		Checkbox,
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
	errorMessage: string = "";
	loading: boolean = false;

	httpService = inject(HttpService);
	userService = inject(UserService);
	router = inject(Router);

	login() {
		console.log(this.email);
		console.log(this.password);
		console.log(this.rememberMe);
		const body = {
			email: this.email,
			password: this.password,
		};
		this.loading = true;
		this.httpService
			.postRequest(this.globals.urls.auth.login, body)
			.subscribe({
				next: (response) => {
					console.log("Login successful: ", response);
					this.loading = false;
					const userData = { email: this.email, role: "teacher" };
					localStorage.setItem("user", JSON.stringify(userData));
					this.userService.loadUserData();
					this.router.navigate(["/dashboard"]);
				},
				error: (error) => {
					console.log(error);
					this.errorMessage = error.message;
					this.loading = false;
				},
			});
	}
}
