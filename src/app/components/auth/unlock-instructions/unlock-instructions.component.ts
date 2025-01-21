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
	selector: "app-unlock-instructions",
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
	templateUrl: "./unlock-instructions.component.html",
	styleUrl: "./unlock-instructions.component.scss",
})
export class UnlockInstructionsComponent {
	globals = globals;
	email: string = "";
	message: string = "";
	loading: boolean = false;
	severity: string = "error";

	httpService = inject(HttpService);

	unlockInstructions() {
		const body = { user: { email: this.email } };
		this.loading = true;
		this.httpService
			.postRequest(this.globals.urls.auth.unlockInstructions, body)
			.subscribe({
				next: (response) => {
					this.message =
						"Unlock instructions email sent successfully";
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
