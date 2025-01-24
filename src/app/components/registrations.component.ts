import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../services/http.service";
import { TableComponent } from "./table.component";
import { SearchComponent } from "./search.component";
import { HttpParams } from "@angular/common/http";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { globals } from "../../globals";

interface Registration {
	id: number;
	email: string;
	created_at: string;
	role: "admin" | "teacher" | "student";
	account_status: "active" | "inactive";
}

@Component({
	selector: "app-registrations",
	standalone: true,
	imports: [
		CommonModule,
		TableComponent,
		SearchComponent,
		ConfirmDialogModule,
	],
	providers: [HttpService, ConfirmationService],
	template: `
		<div class="heading mb-4">
			<h1 class="font-bold text-3xl">Registrations</h1>
		</div>
		<div class="bg-white rounded-border w-full p-4">
			<div class="flex justify-between mb-4">
				<app-search
					placeholder="Search by email..."
					(search)="onSearch($event)"
				></app-search>
			</div>
			<app-table
				[cols]="tableColumns"
				[data]="tableData"
				[buttons]="buttons"
				[loading]="loading"
				[totalRecords]="totalRecords"
				(pageChangeOutput)="onPageChange($event)"
			/>
		</div>
		<p-confirmDialog></p-confirmDialog>
	`,
})
export class RegistrationsComponent implements OnInit {
	private httpService = inject(HttpService);
	private confirmationService = inject(ConfirmationService);

	globals = globals;

	tableData: Registration[] = [];

	tableColumns = [
		{ header: "Email", field: "email" },
		{ header: "Created At", field: "created_at", type: "date" },
		{ header: "Role", field: "role", type: "tag" },
		{ header: "Account Status", field: "account_status", type: "action" },
	];

	buttons = [
		{
			label: (data: Registration) =>
				data.account_status === "active" ? "Active" : "Inactive",
			severity: (data: Registration) =>
				data.account_status === "active" ? "success" : "danger",
			callback: (data: Registration) => this.toggleStatus(data),
		},
	];
	
	page = 1;
	first = 0;
	totalRecords = 0;
	loading: boolean = false;

	ngOnInit() {
		this.getData();
	}

	getData(searchQuery?: string) {
		let params = new HttpParams().set("page", this.page);
		if (searchQuery) params = params.set("q[email_cont]", searchQuery);
		this.httpService
			.getRequest<any>(
				this.globals.urls.registrations.index,
				params
			)
			.subscribe({
				next: (data) => {
					this.tableData = data.registrations;
					this.totalRecords = data.pagination.count;
				},
				error: (error) => {
					console.error("Error fetching registrations:", error);
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

	toggleStatus(registration: Registration) {
		const action = registration.account_status === "active" ? "deactivate" : "activate";

		this.confirmationService.confirm({
			message: `Are you sure you want to ${action} this registration?`,
			header: `${
				action.charAt(0).toUpperCase() + action.slice(1)
			} Confirmation`,
			icon: "pi pi-exclamation-triangle",
			acceptLabel: "Yes, " + action,
			rejectLabel: "No, do not " + action,
			rejectButtonProps: {
				label: "No, do not " + action,
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, " + action,
				severity: action === "deactivate" ? "danger" : "success",
			},
			accept: () => {
				let url = this.globals.urls.registrations.toggleAccountStatus;
				url = url.replace(":id", registration.id.toString());
				this.httpService.postRequest(url, {}).subscribe({
					next: () => {
						this.getData();
					},
					error: (error) => {
						console.error("Error updating status:", error);
					},
				});
			},
		});
	}
}
