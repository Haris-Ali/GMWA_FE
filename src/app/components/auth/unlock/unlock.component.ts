import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { globals } from "../../../../globals";
import { HttpService } from "../../../../services/http.service";

import { Message } from "primeng/message";

@Component({
	selector: "app-unlock",
	standalone: true,
	imports: [CommonModule, RouterModule, Message],
	providers: [HttpService],
	templateUrl: "./unlock.component.html",
	styleUrl: "./unlock.component.scss",
})
export class UnlockComponent {
	globals = globals;
	unlock_token: string = "";

	message: string = "";
	loading: boolean = false;
	severity: string = "error";

	route = inject(ActivatedRoute);
	httpService = inject(HttpService);

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.unlock_token = params["unlock_token"];

			if (this.unlock_token) {
				this.httpService
					.getRequest(
						`${this.globals.urls.auth.unlock}?unlock_token=${this.unlock_token}`
					)
					.subscribe({
						next: (response) => {
							this.message = "Email unlocked. You can now login";
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
				this.message = "No unlock token available";
				this.severity = "error";
				this.loading = true;
			}
		});
	}
}
