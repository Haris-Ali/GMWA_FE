import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { Message } from "primeng/message";

@Component({
	selector: "app-forgot-password",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		Message,
	],
	providers: [HttpService],
	templateUrl: "./forgot-password.component.html",
	styleUrl: "./forgot-password.component.scss",
})
export class ForgotPasswordComponent {
	globals = globals;
	email: string = "";
	errorMessage: string = "";
	loading: boolean = false;

	httpService = inject(HttpService);

	forgotPassword() {
		console.log(this.email);
		const body = { email: this.email };
		this.loading = true;
		this.httpService
			.postRequest(this.globals.urls.auth.forgotPassword, body)
			.subscribe({
				next: (response) => {
					console.log(
						"Forgot password email sent successful: ",
						response
					);
					this.loading = false;
				},
				error: (error) => {
					this.errorMessage = error.message;
					this.loading = false;
				},
			});
	}
}
