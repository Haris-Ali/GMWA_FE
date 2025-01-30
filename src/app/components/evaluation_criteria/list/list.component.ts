import { Component, inject, input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { globals } from "../../../../globals";
import { HttpService } from "../../../../services/http.service";
import { CommonModule } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { Button } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SearchComponent } from "../../search.component";
import { TableComponent } from "../../table.component";
import { HttpParams } from "@angular/common/http";
import { EvaluationCriteria } from "../evaluationCriteria.type";

@Component({
	selector: "app-list",
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

	globals = globals;

	milestoneId = input.required<number>();
	assignmentId = input.required<number>();
	classroomId = input.required<number>();

	tableColumns: any[] = [
		{ header: "Name", field: "name" },
		{ header: "Min Value", field: "min_value" },
		{ header: "Max Value", field: "max_value" },
		{ header: "Weightage", field: "weightage" },
		{ header: "Created At", field: "created_at", type: "date" },
		{ header: "Updated At", field: "updated_at", type: "date" },
		{ header: "Actions", field: "", type: "action" },
	];

	tableData: EvaluationCriteria[] = [];

	buttons: any[] = [
		{
			label: "View",
			severity: "primary",
			callback: (data: EvaluationCriteria) => this.viewDetails(data.id),
		},
		{
			label: "Edit",
			severity: "secondary",
			callback: (data: EvaluationCriteria) => this.editDetails(data.id),
		},
		{
			label: "Delete",
			severity: "danger",
			callback: (data: EvaluationCriteria) =>
				this.deleteEvaluationCriteria(data.id),
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

		const url = this.globals.urls.evaluation_criteria.list.replace(
			":milestone_id",
			this.milestoneId().toString()
		);
		this.httpService.getRequest(url, params).subscribe({
			next: (response: any) => {
				this.loading = false;
				this.tableData = response.evaluation_criteria;
				this.totalRecords = response.pagination.count;
			},
			error: () => {
				this.loading = false;
				this.router.navigate([
					`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/milestones/${this.milestoneId()}`,
				]);
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

	addEvaluationCriteria() {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/milestones/${this.milestoneId()}/evaluation_criteria/add`,
		]);
	}

	viewDetails(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/milestones/${this.milestoneId()}/evaluation_criteria/${id}`,
		]);
	}

	editDetails(id: number) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/milestones/${this.milestoneId()}/evaluation_criteria/${id}/update`,
		]);
	}

	deleteEvaluationCriteria(id: number) {
		this.confirmationService.confirm({
			message: `Are you sure you want to delete this evaluation criteria?`,
			header: "Delete Evaluation Criteria",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not delete",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, delete evaluation criteria",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.evaluation_criteria.delete}`;
				url = url.replace(":id", id.toString());
				this.httpService.deleteRequest(url).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Evaluation Criteria Deleted"
						);
						this.getData();
					},
					error: (error) => {
						console.error(
							"Error deleting evaluation criteria:",
							error
						);
					},
				});
			},
		});
	}
}
