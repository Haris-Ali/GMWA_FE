import { Component, inject, input } from "@angular/core";
import { globals } from "../../../../globals";
import { HttpService } from "../../../../services/http.service";
import { Router, RouterModule } from "@angular/router";
import { Milestone } from "../milestones.type";
import { HttpParams } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { Button } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SearchComponent } from "../../search.component";
import { TableComponent } from "../../table.component";
import { UserService } from "../../../../services/user.service";

@Component({
	selector: "app-milestone-list",
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
export class ListComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private confirmationService = inject(ConfirmationService);
	private userService = inject(UserService);

	assignmentId = input.required<number>();
	classroomId = input.required<number>();
	assignmentEvaluationMethod: string = "";
	assignmentStatus: string = "";

	globals = globals;

	tableColumns: any[] = [
		{ header: "Name", field: "name" },
		{ header: "Weightage", field: "weightage" },
		{ header: "Deadline", field: "dead_line", type: "date" },
		{ header: "Created At", field: "created_at", type: "date" },
		{ header: "Actions", field: "", type: "action" },
	];

	tableData: Milestone[] = [];

	buttons = [
		{
			label: "Perform Evaluation",
			severity: "success",
			callback: (data: Milestone) => this.performEvaluation(data.id),
			condition: (data: Milestone) => data.can_perform_evaluation,
		},
		{
			label: "Edit",
			severity: "secondary",
			callback: (data: Milestone) => this.editDetails(data.id),
		},
		{
			label: "Delete",
			severity: "danger",
			callback: (data: Milestone) => this.deleteMilestone(data.id),
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

		let url = `${this.globals.urls.milestones.list}`;
		url = url.replace(":id", this.assignmentId().toString());
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.tableData = response.milestones;
				this.totalRecords = response.pagination.count;
				this.assignmentEvaluationMethod =
					response.milestones[0].assignment_evaluation_method;
				this.assignmentStatus = response.milestones[0].assignment_status;
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

	addMilestone() {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/milestones/add`,
		]);
	}

	endSubmissions() {
		this.confirmationService.confirm({
			message: `Are you sure you want to end submissions for this assignment?`,
			header: "End Submissions",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not end submissions",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, end submissions",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.assignments.endSubmissions}`;
				url = url.replace(":id", this.assignmentId().toString());
				this.httpService.getRequest(url).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Submissions Ended"
						);
						this.getData();
					},
					error: (error) => {
						console.error("Error ending submissions:", error);
					},
				});
			},
		});
	}

	performEvaluation(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/milestones/${id}/perform_evaluation`,
		]);
	}

	editDetails(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/milestones/${id}/update`,
		]);
	}

	deleteMilestone(id: number) {
		this.confirmationService.confirm({
			message: `Are you sure you want to delete this milestone?`,
			header: "Delete Milestone",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not delete",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, delete milestone",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.milestones.delete}`;
				url = url.replace(":id", id.toString());
				this.httpService.deleteRequest(url).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Milestone Deleted"
						);
						this.getData();
					},
					error: (error) => {
						console.error("Error deleting milestone:", error);
					},
				});
			},
		});
	}
}
