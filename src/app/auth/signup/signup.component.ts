import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { HttpService } from "../../../services/http.service";
import { globals } from "../../../globals";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { Message } from "primeng/message";

@Component({
	selector: "app-signup",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		PasswordModule,
		Message,
	],
	providers: [HttpService],
	templateUrl: "./signup.component.html",
	styleUrl: "./signup.component.scss",
})
export class SignupComponent {
	globals = globals;
	fileName: string | null = null;
	filePreview: string | null = null;
	profilePicture: File | null = null;
	firstName: string = "";
	middleName: string = "";
	lastName: string = "";
	email: string = "";
	password: string = "";
	errorMessage: string = "";
	loading: boolean = false;

	constructor(private httpService: HttpService) {}

	signup() {
		console.log(this.email);
		console.log(this.password);
		const body = {
			email: this.email,
			password: this.password,
		};
		this.loading = true;
		this.httpService
			.postRequest(this.globals.urls.auth.signup, body)
			.subscribe({
				next: (response) => {
					console.log("Signup successful: ", response);
					this.loading = false;
				},
				error: (error) => {
					this.errorMessage = error.message;
					this.loading = false;
				},
			});
	}

	handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		console.log(input);
		if (input.files && input.files[0]) {
			const file = input.files[0];
			this.fileName = file.name;

			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (e: ProgressEvent<FileReader>) => {
					this.filePreview = e.target?.result as string;
				};
				reader.readAsDataURL(file);
			} else {
				this.filePreview = null;
			}
		} else {
			this.fileName = null;
			this.filePreview = null;
		}
		console.log(this.fileName);
	}
}
