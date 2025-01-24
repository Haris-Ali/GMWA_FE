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
	active: boolean;
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
	providers: [ConfirmationService],
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
		{ header: "Account Status", field: "active", type: "action" },
	];

	buttons = [
		{
			label: (data: Registration) =>
				data.active ? "Deactivate" : "Activate",
			severity: (data: Registration) =>
				data.active ? "danger" : "success",
			callback: (data: Registration) => this.toggleStatus(data),
		},
	];

	ngOnInit() {
		this.getData();
	}

	getData(searchQuery?: string) {
		const params = searchQuery
			? new HttpParams().set("q[email_cont]", searchQuery)
			: undefined;

		this.httpService
			.getRequest<Registration[]>(
				this.globals.urls.registrations.index,
				params
			)
			.subscribe({
				next: (data) => {
					this.tableData = data;
				},
				error: (error) => {
					console.error("Error fetching registrations:", error);
				},
			});
	}

	onSearch(event: string) {
		this.getData(event);
	}

	toggleStatus(registration: Registration) {
		const action = registration.active ? "deactivate" : "activate";

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
