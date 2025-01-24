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
		{ header: "Created At", field: "created_at", type: "date" },
		{ header: "Status", field: "status", type: "action" },
	];

	buttons = [
		{
			label: "Resend Invitation",
			severity: "primary",
			callback: (row: Invitation) => this.resendInvitation(row),
			condition: (row: Invitation) => !row.invitation_accepted_at,
		},
		{
			label: "Invitation Accepted",
			severity: "success",
			callback: (row: Invitation) => this.viewInvitation(row),
			condition: (row: Invitation) => row.invitation_accepted_at,
		},
	];

	page = 1;
	first = 0;
	totalRecords = 0;
	loading: boolean = false;

	ngOnInit(): void {
		this.getData();
	}

	getData(searchQuery?: string) {
		let params = new HttpParams().set("page", this.page);
		if (searchQuery) params = params.set("q[email_cont]", searchQuery);

		this.httpService
			.getRequest<any>(
				this.globals.urls.invitations.index,
				params
			)
			.subscribe({
				next: (data) => {
					this.tableData = data.invitations;
					this.totalRecords = data.pagination.count;
				},
				error: (error) => {
					console.error("Error fetching invitations:", error);
				},
			});
	}

	onSearch(event: string) {
		this.page = 1;
		this.getData(event);
	}

	onPageChange(event: any) {
		if (this.first !== event.first) {
			this.first = event.first;
			this.page = Math.floor(this.first / event.rows) + 1;
			this.getData();
		}
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
