import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { HttpService } from "../../../../services/http.service";
import { Router, RouterModule } from "@angular/router";
import { TextareaModule } from "primeng/textarea";
import { Select } from "primeng/select";
import { FileUploadModule } from "primeng/fileupload";
import { TabsModule } from "primeng/tabs";
import { Button } from "primeng/button";
import { globals } from "../../../../globals";
import { UserService } from "../../../../services/user.service";

@Component({
	selector: "app-invite",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TextareaModule,
		Select,
		FileUploadModule,
		TabsModule,
		Button,
		RouterModule,
	],
	templateUrl: "./invite.component.html",
	styleUrl: "./invite.component.scss",
})
export class InviteComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private userService = inject(UserService);

	globals = globals;

	loading = false;
	selectedFile: File | null = null;

	inviteForm = new FormGroup({
		emails: new FormControl("", [Validators.required]),
		role: new FormControl("", [Validators.required]),
	});

	activeTabIndex: string = "0";

	get roles() {
		const userRole = this.userService.getRole() || "teacher";

		if (userRole === "teacher")
			return [{ label: "Student", value: "student" }];

		return [
			{ label: "Teacher", value: "teacher" },
			{ label: "Student", value: "student" },
		];
	}

	ngOnInit() {
		const userRole = this.userService.getRole() || "teacher";

		if (userRole === "teacher") {
			this.inviteForm.patchValue({ role: "student" });
			this.inviteForm.get("role")?.disable();
		}
	}

	onFileSelect(event: any) {
		const file = event.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				try {
					const text = e.target.result;
					const emails = this.parseCSV(text);

					this.inviteForm.patchValue({
						emails: emails.join(", "),
					});

					this.activeTabIndex = "0";
					this.selectedFile = null;
				} catch (error: any) {
					this.selectedFile = null;
				}
			};
			reader.readAsText(file);
		}
	}

	sendInvitations() {
		if (this.inviteForm.invalid) return;

		this.loading = true;
		const emails = this.inviteForm.value.emails
			?.split(",")
			.map((email) => email.trim())
			.filter((email) => email.length > 0);

		if (!emails || emails.length === 0) {
			this.loading = false;
			this.httpService.showError(
				"Please enter at least one email address"
			);
			return;
		}

		const invalidEmails = emails.filter(
			(email) => !this.isValidEmail(email)
		);

		if (invalidEmails.length > 0) {
			this.loading = false;
			this.inviteForm.controls["emails"].setErrors({
				invalid: `Invalid email${
					invalidEmails.length > 1 ? "s" : ""
				} found: ${invalidEmails.join(", ")}`,
			});
			return;
		}

		this.httpService
			.postRequest(this.globals.urls.invitations.new, {
				emails,
				role: this.inviteForm.value.role,
			})
			.subscribe({
				next: () => {
					this.loading = false;
					this.router.navigate(["/invitations"]);
				},
				error: () => {
					this.loading = false;
				},
			});
	}

	private parseCSV(text: string): string[] {
		const emails: string[] = [];
		const rows = text
			.split("\n")
			.map((row) => row.split(",").map((cell) => cell.trim()));

		if (rows.length === 0) {
			throw new Error("CSV file is empty");
		}

		// Find email column index
		const header = rows[0];
		const emailIndex = header.findIndex(
			(col) => col.toLowerCase() === "email"
		);

		if (emailIndex === -1) {
			throw new Error("Email header not found in CSV");
		}

		rows.slice(1).forEach((row) => {
			if (row[emailIndex]) {
				const email = row[emailIndex].trim();
				if (this.isValidEmail(email)) {
					emails.push(email);
				}
			}
		});

		if (emails.length === 0) {
			throw new Error("No valid emails found in the CSV file");
		}

		return emails;
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		return emailRegex.test(email);
	}
}
