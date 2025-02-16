import { Component, inject, input } from "@angular/core";
import { globals } from "../../../../globals";
import { HttpService } from "../../../../services/http.service";
import { Router, RouterModule } from "@angular/router";
import { HttpParams } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { Button } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SearchComponent } from "../../search.component";
import { TableComponent } from "../../table.component";
import { UserService } from "../../../../services/user.service";

@Component({
	selector: "app-groups-list",
	standalone: true,
	imports: [
		CommonModule,
		TableComponent,
		SearchComponent,
		ConfirmDialogModule,
		Button,
		RouterModule,
	],
	providers: [ConfirmationService, HttpService],
	templateUrl: "./list.component.html",
	styleUrl: "./list.component.scss",
})
export class GroupsListComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private confirmationService = inject(ConfirmationService);
	private userService = inject(UserService);

	userRole = this.userService.getRole();

	assignmentId = input.required<number>();
	classroomId = input.required<number>();
	assignmentEvaluationMethod: string = "";
	assignmentStatus: string = "";

	globals = globals;

	tableColumns: any[] = [
		{ header: "Name", field: "name" },
		{ header: "Marks", field: "marks" },
		{ header: "Actions", field: "", type: "action" },
	];

	tableData: any[] = [];

	buttons = [
		{
			label: "View",
			severity: "primary",
			callback: (data: any) => this.viewDetails(data.id),
		},
		{
			label: "Edit",
			severity: "secondary",
			callback: (data: any) => this.editDetails(data.id),
			condition: (data: any) => this.userRole === "teacher",
		},
		{
			label: "Delete",
			severity: "danger",
			callback: (data: any) => this.deleteGroup(data.id),
			condition: (data: any) => this.userRole === "teacher",
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

		let url = `${this.globals.urls.groups.list}`;
		url = url.replace(":id", this.assignmentId().toString());
		this.httpService.getRequest(url, params).subscribe({
			next: (response: any) => {
				this.tableData = response.groups;
				this.totalRecords = response.pagination.count;
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

	addGroup() {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/groups/add`,
		]);
	}

	viewDetails(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/groups/${id}`,
		]);
	}

	editDetails(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/groups/${id}/update`,
		]);
	}

	deleteGroup(id: number) {
		this.confirmationService.confirm({
			message: `Are you sure you want to delete this group?`,
			header: "Delete Group",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not delete group",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, delete group",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.groups.delete}`;
				url = url.replace(":id", id.toString());
				this.httpService.deleteRequest(url).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Group Deleted"
						);
						this.getData();
					},
					error: (error) => {
						console.error("Error deleting group:", error);
					},
				});
			},
		});
	}
}
