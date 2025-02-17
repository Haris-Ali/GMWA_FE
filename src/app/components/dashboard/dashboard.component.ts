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
	userRole: keyof typeof DASHBOARD_CONFIG = "teacher";
	userData: any = {};

	ngOnInit() {
		const storedData = localStorage.getItem("user-data");
		const user: User | null = storedData ? JSON.parse(storedData) : null;
		this.userRole = user?.role ?? "teacher";
		this.dashboardCards =
			DASHBOARD_CONFIG[this.userRole] || DASHBOARD_CONFIG["teacher"];
		this.fetchStatsData();
	}

	fetchStatsData() {
		this.httpService
			.getRequest(this.globals.urls.dashboard.data)
			.subscribe({
				next: (response: any) => {
					this.userData = response.data;
					console.log(this.userData);
				},
				error: (error) => {
					console.error("Error: ", error);
				},
			});
	}
}

interface User {
	id: number;
	email: string;
	role: "teacher" | "student" | "super_admin";
	first_name: string;
	middle_name: string;
	last_name: string;
	account_status: "active" | "inactive";
	created_at: string;
	updated_at: string;
}
