import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../../../services/http.service";
import { TableComponent } from "../../table.component";
import { SearchComponent } from "../../search.component";
import { HttpParams } from "@angular/common/http";
import { Button } from "primeng/button";
import { Router, RouterModule } from "@angular/router";
import { Invitation } from "../invitations.types";
import { globals } from "../../../../globals";

@Component({
	selector: "app-list",
	standalone: true,
	imports: [CommonModule, RouterModule, TableComponent, SearchComponent, Button],
	templateUrl: "./list.component.html",
	styleUrl: "./list.component.scss",
})
export class ListComponent implements OnInit {
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;

	tableData: Invitation[] = [];

	tableColumns = [
		{ header: "Email", field: "email" },
		{ header: "Created At", field: "invitation_created_at", type: "date" },
		{ header: "Status", field: "status", type: "action" },
	];

	buttons = [
		{
			label: "Resend Invitation",
			severity: "primary",
			callback: (row: Invitation) => this.resendInvitation(row),
			condition: (row: Invitation) => row.status === "pending",
		},
		{
			label: "Accepted",
			severity: "success",
			callback: (row: Invitation) => this.viewInvitation(row),
			condition: (row: Invitation) => row.status === "accepted",
		},
	];

	ngOnInit(): void {
		this.getData();
	}

	getData(searchQuery?: string) {
		const params = searchQuery
			? new HttpParams().set("q[email_cont]", searchQuery)
			: undefined;

		this.httpService
			.getRequest<Invitation[]>(
				this.globals.urls.invitations.index,
				params
			)
			.subscribe({
				next: (data) => {
					this.tableData = data;
				},
				error: (error) => {
					console.error("Error fetching invitations:", error);
					this.tableData = [
						{
							id: 1,
							email: "test@test.com",
							invitation_created_at: new Date(),
							invitation_accepted_at: new Date(),
							status: "accepted",
						},
						{
							id: 2,
							email: "test2@test.com",
							invitation_created_at: new Date(),
							invitation_accepted_at: new Date(),
							status: "pending",
						},
					];
				},
			});
	}

	onSearch(event: string) {
		this.getData(event);
	}

	resendInvitation(row: Invitation) {
		let url = this.globals.urls.invitations.resend;
		url = url.replace(":id", row.id.toString());
		this.httpService.postRequest(url, {}).subscribe({
			next: () => {
				this.getData();
			},
			error: (error) => {
				console.error("Error updating status:", error);
			},
		});
	}

	viewInvitation(row: Invitation) {}
}
