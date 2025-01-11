import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { HttpService } from "../../../services/http.service";
import { globals } from "../../../globals";

import { DASHBOARD_CONFIG } from "./dashboard.config";

@Component({
	selector: "app-dashboard",
	standalone: true,
	imports: [CommonModule, RouterModule],
	providers: [HttpService],
	templateUrl: "./dashboard.component.html",
	styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
	globals = globals;
	httpService = inject(HttpService);
	dashboardCards: any[] = [];
	userRole: string = "teacher";
	userData: any = {};

	ngOnInit() {
		const storedData = localStorage.getItem("user-data");
		const user = storedData ? JSON.parse(storedData) : null;
		// this.userRole = user.role;
		// this.dashboardCards = DASHBOARD_CONFIG[user.role] || DASHBOARD_CONFIG['teacher'];
		this.dashboardCards = DASHBOARD_CONFIG["teacher"];
		// this.fetchStatsData();
	}

	fetchStatsData() {
		const body = { role: this.userRole };
		this.httpService
			.postRequest(this.globals.urls.dashboard.data, body)
			.subscribe({
				next: (response) => {
					console.log("Response: ", response);
				},
				error: (error) => {
					console.error("Error: ", error);
				},
			});
	}
}
