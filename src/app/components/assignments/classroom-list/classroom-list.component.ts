import { Component, effect, inject, input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../../../services/http.service";
import { TableComponent } from "../../table.component";
import { SearchComponent } from "../../search.component";
import { HttpParams } from "@angular/common/http";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { Button } from "primeng/button";
import { globals } from "../../../../globals";
import { Assignment } from "../assignments.type";
import { UserService } from "../../../../services/user.service";

@Component({
	selector: "app-classroom-assignments-list",
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
	template: `
		<div class="heading mb-4">
			<h6 class="font-bold text-xl">Classroom Assignments</h6>
		</div>
		<div class="bg-white rounded-border w-full">
			<div class="flex justify-between mb-4 md:flex-row flex-col gap-2">
				<app-search
					placeholder="Search assignments..."
					(search)="onSearch($event)"
				></app-search>
				<div class="flex gap-2">
					<p-button
						type="button"
						label="Add Assignment"
						icon="pi pi-plus"
						(onClick)="addAssignment()"
						*ngIf="userRole === 'teacher'"
					></p-button>
				</div>
			</div>
			<app-table
				[cols]="tableColumns"
				[data]="tableData"
				[buttons]="buttons"
				[loading]="loading"
				[totalRecords]="totalRecords"
				[rows]="5"
				(pageChangeOutput)="onPageChange($event)"
			/>
		</div>
		<p-confirmDialog></p-confirmDialog>
	`,
})
export class ClassroomAssignmentsListComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private confirmationService = inject(ConfirmationService);
	private userService = inject(UserService);

	classroomId = input.required<number>();
	globals = globals;

	userRole = this.userService.getRole() || "teacher";

	tableColumns: any[] = [
		{ header: "Name", field: "name" },
		{ header: "Evaluation Method", field: "evaluation_method" },
		{
			header: "Self Assesment",
			field: "evaluation_method_setting.self_assessment",
		},
		{ header: "Total Marks", field: "total_marks" },
		{ header: "Created At", field: "created_at", type: "date" },
		{ header: "Status", field: "status", type: "tag" },
		{ header: "Actions", field: "", type: "action" },
	];

	tableData: Assignment[] = [];

	buttons = [
		{
			label: "View",
			severity: "primary",
			callback: (data: Assignment) => this.viewDetails(data.id),
		},
		{
			label: "Show Results",
			severity: "success",
			callback: (data: Assignment) => this.showResults(data.id),
			condition: (data: Assignment) =>
				data.can_show_results && this.userRole === "teacher",
		},
		{
			label: "Show Results",
			severity: "success",
			callback: (data: Assignment) => this.calculateMarks(data),
			condition: (data: Assignment) =>
				data.can_calculate_student_marks && this.userRole === "student",
		},
		{
			label: (data: Assignment) =>
				data.status === "published" ? "Move to Draft" : "Publish",
			severity: (data: Assignment) =>
				data.status === "published" ? "danger" : "success",
			callback: (data: Assignment) => this.toggleStatus(data),
			condition: (data: Assignment) => this.userRole === "teacher",
		},
		{
			label: "Edit",
			severity: "contrast",
			callback: (data: Assignment) => this.editDetails(data.id),
			condition: (data: Assignment) =>
				data.status !== "published" && this.userRole === "teacher",
		},
		{
			label: "Delete",
			severity: "danger",
			callback: (data: Assignment) => this.deleteAssignment(data.id),
			condition: (data: Assignment) => this.userRole === "teacher",
		},
	];

	page = 1;
	first = 0;
	totalRecords = 0;
	loading: boolean = false;

	constructor() {
		effect(() => {
			this.getData();
		});
	}

	getData(searchQuery?: string) {
		let params = new HttpParams().set("page", this.page);
		if (searchQuery) params = params.set("q[name_cont]", searchQuery);

		let url = this.globals.urls.assignments.classroomAssignments;
		url = url.replace(":classroom_id", this.classroomId().toString());
		this.httpService.getRequest(url, params).subscribe({
			next: (response: any) => {
				this.tableData = response.assignments;
				this.totalRecords = response.pagination.count;
				this.loading = false;
			},
			error: () => {
				this.loading = false;
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

	addAssignment() {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/add`,
		]);
	}

	viewDetails(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${id}`,
		]);
	}

	showResults(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${id}/results`,
		])
	}

	calculateMarks(data: any) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${data.id}/${data.grouping_id}/student-marks`,
		])
	}

	toggleStatus(assignment: Assignment) {
		const action =
			assignment.status === "published" ? "move to draft" : "publish";

		this.confirmationService.confirm({
			message: `Are you sure you want to ${action} this assignment?`,
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
				severity: action === "move to draft" ? "danger" : "success",
			},
			accept: () => {
				let url = this.globals.urls.assignments.toggleStatus;
				url = url.replace(":id", assignment.id.toString());
				this.httpService.postRequest(url, {}).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Assignment Status Updated"
						);
						this.getData();
					},
					error: (error) => {
						console.error("Error updating status:", error);
					},
				});
			},
		});
	}

	editDetails(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${id}/update`,
		]);
	}

	deleteAssignment(id: number) {
		this.confirmationService.confirm({
			message: `Are you sure you want to delete this assignment?`,
			header: "Delete Assignment",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not delete",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, delete assignment",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.assignments.delete}`;
				url = url.replace(":id", id.toString());
				this.httpService.deleteRequest(url).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Assignment Deleted"
						);
						this.getData();
					},
					error: (error) => {
						console.error("Error deleting assignment:", error);
					},
				});
			},
		});
	}
}
