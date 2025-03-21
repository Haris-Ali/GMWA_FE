import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { Message } from "primeng/message";

@Component({
	selector: "app-confirmation-instructions",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ButtonModule,
		InputTextModule,
		Message,
	],
	providers: [HttpService],
	templateUrl: "./confirmation-instructions.component.html",
	styleUrl: "./confirmation-instructions.component.scss",
})
export class ConfirmationInstructionsComponent {
	globals = globals;
	email: string = "";
	message: string = "";
	loading: boolean = false;
	severity: string = "error";

	httpService = inject(HttpService);

	confirmationInstructions() {
		const body = { user: { email: this.email } };
		this.loading = true;
		this.httpService
			.postRequest(this.globals.urls.auth.confirmationInstructions, body)
			.subscribe({
				next: (response) => {
					this.message =
						"Confirmation instructions email sent successfully";
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
