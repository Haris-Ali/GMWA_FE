import { Component } from "@angular/core";
import { Checkbox } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { FormsModule } from "@angular/forms";
import { Card } from "primeng/card";
import { Message } from "primeng/message";
import { HttpService } from "../../../services/http.service";
import { globals } from "../../../globals";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		// Checkbox,
		ButtonModule,
		InputTextModule,
		PasswordModule,
		Card,
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
	errorMessage: string = "";
	loading: boolean = false;

	constructor(private httpService: HttpService) {}

	login() {
		console.log(this.email);
		console.log(this.password);
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
				},
				error: (error) => {
					this.errorMessage = error.message;
					this.loading = false;
				},
			});
	}
}
