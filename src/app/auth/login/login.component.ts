import { Component } from "@angular/core";
import { Checkbox } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [Checkbox, ButtonModule, InputTextModule],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {}
