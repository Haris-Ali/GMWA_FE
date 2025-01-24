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
	providers: [ConfirmationService],
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
		{ header: "Enrolled Students", field: "enrolled_students" },
		{ header: "Total Assignments", field: "assignments" },
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

	ngOnInit() {
		this.getData();
	}

	getData(searchQuery?: string) {
		const params = searchQuery
			? new HttpParams().set("q[name_cont]", searchQuery)
			: undefined;
		this.httpService
			.getRequest<TableData[]>(this.globals.urls.classrooms.list, params)
			.subscribe({
				next: (data: any) => {
					this.tableData = data;
				},
				error: (error: any) => {
					console.error("Error fetching classroom data:", error);
				},
			});
	}

	onSearch(event: any) {
		this.getData(event);
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
				this.httpService
					.deleteRequest(
						`${this.globals.urls.classrooms.delete}/${id}`
					)
					.subscribe({
						next: () => {
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
