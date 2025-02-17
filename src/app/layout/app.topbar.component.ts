import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { LayoutService } from "./service/app.layout.service";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../services/http.service";
import { globals } from "../../globals";
import { UserService } from "../../services/user.service";

@Component({
	selector: "app-topbar",
	standalone: true,
	imports: [RouterModule, CommonModule],
	// providers: [LayoutService],
	templateUrl: "./app.topbar.component.html",
})
export class AppTopBarComponent {
	httpService = inject(HttpService);
	userService = inject(UserService);
	router = inject(Router);
	globals = globals;
	items!: MenuItem[];

	@ViewChild("menubutton") menuButton!: ElementRef;

	@ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;

	@ViewChild("topbarmenu") menu!: ElementRef;

	constructor(public layoutService: LayoutService) {}

	logout() {
		this.httpService
			.deleteRequest(this.globals.urls.auth.logout)
			.subscribe({
				next: (response) => {
					localStorage.clear();
					this.userService.resetRole();
					this.router.navigate(["/auth/login"]);
				},
				error: (error) => {
					console.log("error", error);
				},
			});
	}

	profile() {
		this.router.navigate(["/profile"]);
	}
}
