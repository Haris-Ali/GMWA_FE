import { Component } from "@angular/core";
import { Checkbox } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [
		FormsModule,
		Checkbox,
		ButtonModule,
		InputTextModule,
		PasswordModule,
	],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	password!: string;
}
