import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { globals } from "../../../../globals";
import { HttpService } from "../../../../services/http.service";

import { Message } from "primeng/message";

@Component({
	selector: "app-confirmation",
	standalone: true,
	imports: [CommonModule, RouterModule, Message],
	providers: [HttpService],
	templateUrl: "./confirmation.component.html",
	styleUrl: "./confirmation.component.scss",
})
export class ConfirmationComponent {
	globals = globals;
	confirmation_token: string = "";

	message: string = "";
	loading: boolean = false;
	severity: string = "error";

	route = inject(ActivatedRoute);
	httpService = inject(HttpService);

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.confirmation_token = params["confirmation_token"];

			if (this.confirmation_token) {
				this.httpService
					.getRequest(
						`${this.globals.urls.auth.confirmation}/${this.confirmation_token}`
					)
					.subscribe({
						next: (response) => {
							this.message =
								"Email confirmed. You can now login if your account is active";
							this.severity = "success";
							this.loading = false;
						},
						error: (error) => {
							this.message = error.message
								? error.message
								: error;
							this.severity = "error";
							this.loading = false;
						},
					});
			} else {
				this.message = "No confirmation token available";
				this.severity = "error";
				this.loading = true;
			}
		});
	}
}
