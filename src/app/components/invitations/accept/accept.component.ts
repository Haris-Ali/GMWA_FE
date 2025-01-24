import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { globals } from "../../../../globals";
import { HttpService } from "../../../../services/http.service";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { Message } from "primeng/message";

@Component({
	selector: "app-accept",
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
	templateUrl: "./accept.component.html",
	styleUrl: "./accept.component.scss",
})
export class AcceptComponent {
	globals = globals;
	invitation_token: string = "";
	email: string = "";
	password: string = "";
	password_confirmation: string = "";

	message: string = "";
	loading: boolean = false;
	severity: string = "error";

	validInvitationToken: boolean = false;

	route = inject(ActivatedRoute);
	router = inject(Router);
	httpService = inject(HttpService);

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.invitation_token = params["invitation_token"];

			if (this.invitation_token) {
				this.httpService
					.getRequest(
						`${this.globals.urls.invitations.accept}?invitation_token=${this.invitation_token}`
					)
					.subscribe({
						next: (response: any) => {
							this.message = response.message;
							this.severity = "success";
							this.validInvitationToken = true;
							this.email = response.email;
							setTimeout(() => {
								this.message = "";
							}, 2000);
						},
						error: (error) => {
							this.message = error.message
								? error.message
								: error;
							this.severity = "error";
						},
					});
			} else {
				this.message = "No invitation token available";
				this.severity = "error";
				this.loading = true;
			}
		});
	}

	setupAccount() {
		const body = {
			user: {
				invitation_token: this.invitation_token,
				email: this.email,
				password: this.password,
				password_confirmation: this.password_confirmation,
			},
		};
		this.loading = true;
		this.httpService
			.patchRequest(this.globals.urls.invitations.setupAccount, body)
			.subscribe({
				next: (response) => {
					this.message =
						"Account setup successfully. You can now login with your email and password";
					this.severity = "success";
					this.loading = false;
					this.router.navigate(["/auth/login"]);
				},
				error: (error) => {
					this.message = error.message ? error.message : error;
					this.severity = "error";
					this.loading = false;
				},
			});
	}
}
