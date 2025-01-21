import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { globals } from "../../../../globals";
import { HttpService } from "../../../../services/http.service";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { Message } from "primeng/message";

@Component({
	selector: "app-reset-password",
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
	templateUrl: "./reset-password.component.html",
	styleUrl: "./reset-password.component.scss",
})
export class ResetPasswordComponent {
	globals = globals;
	reset_password_token: string = "";
	password: string = "";
	password_confirmation: string = "";

	message: string = "";
	loading: boolean = false;
	severity: string = "error";

	route = inject(ActivatedRoute);
	httpService = inject(HttpService);

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.reset_password_token = params["reset_password_token"];
		});
		if (!this.reset_password_token) {
			this.message = "No reset password token available";
			this.severity = "error";
			this.loading = true;
		}
	}

	resetPassword() {
		const body = {
			user: {
				reset_password_token: this.reset_password_token,
				password: this.password,
				password_confirmation: this.password_confirmation,
			},
		};
		this.loading = true;
		this.httpService
			.patchRequest(this.globals.urls.auth.editPassword, body)
			.subscribe({
				next: (response) => {
					this.message =
						"Password reset successfully. You can now login with the updated password";
					this.severity = "success";
					this.loading = false;
				},
				error: (error) => {
					this.message = error.message ? error.message : error;
					this.severity = "error";
					this.loading = false;
				},
			});
	}
}
