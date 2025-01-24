import { Component, inject } from "@angular/core";
import { TableComponent } from "../../table.component";
import { SearchComponent } from "../../search.component";
import { TableColumns, TableData } from "../classrooms.types";
import { Button } from "primeng/button";
import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";
import { HttpParams } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { ConfirmDialog, ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";

@Component({
	selector: "app-list",
	standalone: true,
	imports: [
		TableComponent,
		RouterModule,
		SearchComponent,
		Button,
		ConfirmDialogModule,
	],
	providers: [HttpService, ConfirmationService],
	templateUrl: "./list.component.html",
	styleUrl: "./list.component.scss",
})
export class ListComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private confirmationService = inject(ConfirmationService);

	globals = globals;

	tableColumns: TableColumns[] = [
		{ header: "Name", field: "name" },
		{ header: "Created At", field: "created_at", type: "date" },
		{ header: "Enrolled Students", field: "enrolled_students_count" },
		{ header: "Total Assignments", field: "assignments_count" },
		{ header: "Actions", field: "", type: "action" },
	];

	tableData: TableData[] = [];

	buttons = [
		{
			label: "View Details",
			severity: "primary",
			callback: (data: any) => this.viewDetails(data.id),
		},
		{
			label: "Edit Classroom",
			severity: "secondary",
			callback: (data: any) => this.editDetails(data.id),
		},
		{
			label: "Delete Classroom",
			severity: "danger",
			callback: (data: any) => this.deleteClassroom(data.id),
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
		if (searchQuery) params = params.set("q[name_cont]", searchQuery);

		this.httpService
			.getRequest<TableData[]>(
				`${this.globals.urls.classrooms.list}`,
				params
			)
			.subscribe({
				next: (data: any) => {
					this.tableData = data.classrooms;
					this.totalRecords = data.pagination.count;
				},
				error: (error: any) => {
					console.error("Error fetching classroom data:", error);
				},
			});
	}

	onSearch(event: any) {
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

	viewDetails(id: number) {
		this.router.navigate([`/classrooms/${id}/view`]);
	}

	editDetails(id: number) {
		this.router.navigate([`/classrooms/${id}/update`]);
	}

	deleteClassroom(id: number) {
		this.confirmationService.confirm({
			message: "Are you sure you want to delete this classroom?",
			header: "Delete Confirmation",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not delete",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, delete classroom",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.classrooms.delete}`;
				url = url.replace(":id", id.toString());
				this.httpService
					.deleteRequest(url)
					.subscribe({
						next: (response: any) => {
							this.httpService.showSuccess(response.message, "Classroom Deleted");
							this.getData();
						},
						error: (error) => {
							console.error("Error deleting classroom:", error);
						},
					});
			},
		});
	}
}
