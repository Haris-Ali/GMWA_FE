import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { Message } from "primeng/message";
import { SelectButton } from "primeng/selectbutton";
import { HttpHeaders, HttpParams } from "@angular/common/http";

@Component({
	selector: "app-signup",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ButtonModule,
		InputTextModule,
		PasswordModule,
		Message,
		SelectButton,
	],
	providers: [HttpService],
	templateUrl: "./signup.component.html",
	styleUrl: "./signup.component.scss",
})
export class SignupComponent {
	globals = globals;
	fileName: string | null = null;
	filePreview: string | null = null;
	avatar: File | null = null;
	firstName: string = "";
	middleName: string = "";
	lastName: string = "";
	email: string = "";
	password: string = "";
	role: string = "Teacher";
	message: string = "";
	loading: boolean = false;

	roles: string[] = ["Teacher", "Student"];

	severity: string = "error";

	httpService = inject(HttpService);

	signup() {
		const formData = new FormData();
		if (this.avatar) formData.append("user[avatar]", this.avatar);
		formData.append("user[first_name]", this.firstName.trim());
		formData.append("user[middle_name]", this.middleName.trim());
		formData.append("user[last_name]", this.lastName.trim());
		formData.append("user[email]", this.email.trim());
		formData.append("user[password]", this.password.trim());
		formData.append("user[role]", this.role.toLowerCase());
		this.loading = true;

		this.httpService
			.postRequest(
				this.globals.urls.auth.signup,
				formData,
				undefined,
				true
			)
			.subscribe({
				next: (response: any) => {
					this.message = response.message;
					this.severity = "success";
					this.loading = false;
				},
				error: (error) => {
					this.message = error.message;
					this.severity = "error";
					this.loading = false;
				},
			});
	}

	handleFileChange(event: any) {
		const input = event.target as HTMLInputElement;
		console.log(input);
		if (input.files && input.files[0]) {
			const file = input.files[0];
			this.avatar = file;
			this.fileName = file.name;

			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				this.filePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
		console.log(this.fileName);
	}
}
