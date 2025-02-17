import { Component, inject } from "@angular/core";
import { HttpService } from "../../services/http.service";
import { globals } from "../../globals";
import { CommonModule } from "@angular/common";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Button } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
	selector: "app-profile",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		Button,
		InputTextModule,
		PasswordModule,
		ConfirmDialogModule
	],
	providers: [HttpService, ConfirmationService],
	template: `
		<div class="heading mb-4">
			<h1 class="font-bold text-3xl">Profile</h1>
		</div>
		<div class="bg-white rounded-border w-full p-4">
			<form
				[formGroup]="profileForm"
				(ngSubmit)="onSubmit()"
				class="flex flex-col gap-4 w-full lg:w-1/2"
			>
				<div class="flex flex-col gap-2">
					<label for="email" class="font-bold text-base">
						Email
						<span class="text-red-600">*</span>
					</label>
					<input
						id="email"
						type="email"
						autocomplete="off"
						autofocus
						pInputText
						placeholder="Email address here..."
						formControlName="email"
						name="email"
						class="w-full rounded-md mt-[5px] p-[10] border outline-none"
						required
						pattern="^[^s@]+@[^s@]+.[^s@]{2,}$"
					/>
					<div
						*ngIf="
							profileForm.get('email')?.invalid &&
							profileForm.get('email')?.dirty
						"
						class="text-red-600 mt-2"
					>
						<span
							*ngIf="profileForm.get('email')?.errors?.required"
						>
							Email is required.
						</span>
						<span *ngIf="profileForm.get('email')?.errors?.pattern">
							Enter a valid email address
						</span>
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<label for="first_name" class="font-bold text-base">
						First Name
						<span class="text-red-600">*</span>
					</label>
					<input
						id="first_name"
						type="name"
						autocomplete="false"
						autofocus
						pInputText
						placeholder="First name here..."
						formControlName="first_name"
						name="first_name"
						class="w-full rounded-md mt-[5px] p-[10] border outline-none"
						required
						[ngClass]="{
							'ng-invalid ng-dirty':
								profileForm.get('first_name')?.invalid && profileForm.get('first_name')?.dirty
						}"
					/>
					<div
						*ngIf="profileForm.get('first_name')?.invalid && profileForm.get('first_name')?.dirty"
						class="text-red-600 mt-2"
					>
						First name is required
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<label for="middle_name" class="font-bold text-base">
						Middle Name
						<span class="text-red-600">*</span>
					</label>
					<input
						id="middle_name"
						type="name"
						autocomplete="false"
						autofocus
						pInputText
						placeholder="Middle name here..."
						formControlName="middle_name"
						name="middle_name"
						class="w-full rounded-md mt-[5px] p-[10] border outline-none"
						[ngClass]="{
							'ng-invalid ng-dirty':
								profileForm.get('middle_name')?.invalid && profileForm.get('middle_name')?.dirty
						}"
					/>
					<div
						*ngIf="profileForm.get('middle_name')?.invalid && profileForm.get('middle_name')?.dirty"
						class="text-red-600 mt-2"
					>
						Middle name is required
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<label for="last_name" class="font-bold text-base">
						Last Name
						<span class="text-red-600">*</span>
					</label>
					<input
						id="last_name"
						type="name"
						autocomplete="false"
						autofocus
						pInputText
						placeholder="Last name here..."
						formControlName="last_name"
						name="last_name"
						class="w-full rounded-md mt-[5px] p-[10] border outline-none"
						required
						[ngClass]="{
							'ng-invalid ng-dirty':
								profileForm.get('last_name')?.invalid && profileForm.get('last_name')?.dirty
						}"
					/>
					<div
						*ngIf="profileForm.get('last_name')?.invalid && profileForm.get('last_name')?.dirty"
						class="text-red-600 mt-2"
					>
						Last name is required
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<label for="password" class="font-bold text-base">Password (Leave blank to keep as is)<span class="text-red-600">*</span></label>
					<p-password 
						id="password" 
						placeholder="New password here..." 
						[toggleMask]="true" 
						formControlName="password" 
						name="password" 
						styleClass="rounded-md w-full mt-[5px] border outline-none" 
						inputStyleClass="w-full p-[10]"  
						feedback="false"
						minlength="8"
					/>
					<div *ngIf="profileForm.get('password')?.invalid && profileForm.get('password')?.dirty" class="text-red-600 mt-2">
						<span *ngIf="profileForm.get('password')?.errors?.required">Password is required</span>
						<span *ngIf="profileForm.get('password')?.errors?.minlength">Password must be 8 characters minimum</span>
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<label for="password_confirmation" class="font-bold text-base">Confirm Password<span class="text-red-600">*</span></label>
					<p-password 
						id="password_confirmation" 
						placeholder="Confirm password here..." 
						[toggleMask]="true" 
						formControlName="password_confirmation" 
						name="password_confirmation" 
						styleClass="rounded-md w-full mt-[5px] border outline-none" 
						inputStyleClass="w-full p-[10]" 
						feedback="false"
						minlength="8"
					/>
					<div *ngIf="profileForm.get('password_confirmation')?.invalid && profileForm.get('password_confirmation')?.dirty" class="text-red-600 mt-2">
						<span *ngIf="profileForm.get('password_confirmation')?.errors?.required">Password is required</span>
						<span *ngIf="profileForm.get('password_confirmation')?.errors?.minlength">Password must be 8 characters minimum</span>
					</div>
				</div>
				<!-- <div class="flex flex-col gap-2">
					<label for="current_password" class="font-bold text-base">Current Password<span class="text-red-600">*</span></label>
					<p-password 
						id="current_password" 
						placeholder="Current password here..." 
						[toggleMask]="true" 
						formControlName="current_password" 
						name="current_password" 
						styleClass="rounded-md w-full mt-[5px] border outline-none" 
						inputStyleClass="w-full p-[10]" 
						feedback="false"
						required
						minlength="8"
					/>
					<div *ngIf="profileForm.get('current_password')?.invalid && profileForm.get('current_password')?.dirty" class="text-red-600 mt-2">
						<span *ngIf="profileForm.get('current_password')?.errors?.required">Password is required</span>
						<span *ngIf="profileForm.get('current_password')?.errors?.minlength">Password must be 8 characters minimum</span>
					</div>
				</div> -->
				<div class="flex gap-2">
					<p-button
						type="button"
						severity="danger"
						label="Cancel Account"
						class="text-gray-400 rounded-md"
						(onClick)="cancelAccount()"
					></p-button>
					<p-button
						type="submit"
						label="Update Profile"
						class="text-gray-400 rounded-md"
					></p-button>
				</div>
			</form>
		</div>
		<p-confirmDialog></p-confirmDialog>
	`,
	styles: ``,
})
export class ProfileComponent {
	private httpService = inject(HttpService);
	private confirmationService = inject(ConfirmationService);
	private router = inject(Router);
	private userService = inject(UserService);
	
	globals = globals;

	userData: any;

	profileForm = new FormGroup({
		email: new FormControl("", [Validators.required]),
		first_name: new FormControl("", [Validators.required]),
		middle_name: new FormControl(""),
		last_name: new FormControl("", [Validators.required]),
		password: new FormControl(""),
		password_confirmation: new FormControl(""),
		// current_password: new FormControl("", [Validators.required]),
	});

	ngOnInit() {
		this.getData();
	}

	getData() {
		let url = this.globals.urls.currentUser;
		this.httpService.getRequest(url).subscribe({
			next: (res: any) => {
				this.userData = res.user;
				this.profileForm.patchValue({
					email: this.userData.email,
					first_name: this.userData.first_name,
					middle_name: this.userData.middle_name,
					last_name: this.userData.last_name,
				});
				if (this.userData.role === "student")
					this.profileForm.get("email")?.disable();
			},
			error: (err: any) => {
				this.httpService.showError(err, "User");
			},
		});
	}

	onSubmit() {
		let body = {
			user: {
				email: this.profileForm.get("email")?.value,
				first_name: this.profileForm.get("first_name")?.value,
				middle_name: this.profileForm.get("middle_name")?.value,
				last_name: this.profileForm.get("last_name")?.value,
				...(this.profileForm.get("password")?.value && {
					password: this.profileForm.get("password")?.value,
				}),
				...(this.profileForm.get("password_confirmation")?.value && {
					password_confirmation: this.profileForm.get("password_confirmation")?.value,
				}),
				// current_password: this.profileForm.get("current_password")?.value
			}
		}
		this.httpService.putRequest(this.globals.urls.auth.signup, body).subscribe({
			next: (response: any) => {
				this.httpService.showSuccess(response.message, "Profile")
			},
			error: (error: any) => {
				this.httpService.showError(error, "Profile");
			}
		})
	}

	cancelAccount() {
		this.confirmationService.confirm({
			message: "Are you sure you want to delete/cancel your account?",
			header: "Delete Confirmation",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not delete",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, delete account",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.auth.signup}`;
				this.httpService.deleteRequest(url).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Account Deleted"
						);
						localStorage.clear();
						this.userService.resetRole();
						this.router.navigate(["/auth/login"]);
					},
					error: (error) => {
						console.error("Error deleting account:", error);
					},
				});
			},
		});
	}
}
