import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { TableComponent } from "../../table.component";
import { SearchComponent } from "../../search.component";
import { HttpService } from "../../../../services/http.service";
import { Router, RouterModule } from "@angular/router";
import { globals } from "../../../../globals";
import { HttpParams } from "@angular/common/http";
import { Button } from "primeng/button";

@Component({
	selector: "app-assignment-results",
	standalone: true,
	imports: [
		CommonModule,
		TableComponent,
		SearchComponent,
		RouterModule,
		Button,
	],
	providers: [HttpService],
	templateUrl: "./assignment-results.component.html",
	styleUrl: "./assignment-results.component.scss",
})
export class AssignmentResultsComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;
	classroomId = input<number>();
	assignmentId = input<number>();

	tableColumns: any[] = [
		{ header: "Student ID", field: "student_id" },
		{ header: "Student Name", field: "student_name" },
		{ header: "Group Name", field: "group_name" },
		{ header: "Group Marks", field: "group_marks" },
		{ header: "Actions", field: "", type: "action" },
	];

	tableData: any[] = [];

	buttons: any[] = [
		{
			label: "Calculate Marks",
			severity: "primary",
			callback: (data: any) => this.calculateMarks(data),
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
		let url = this.globals.urls.assignments.showResults;
		url = url.replace(":id", this.assignmentId()?.toString() ?? "");
		this.httpService.getRequest(url, params).subscribe({
			next: (response: any) => {
				console.log(response);

				this.tableData = response.results;
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

	calculateMarks(data: any) {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}/${
				data.grouping_id
			}/student-marks`,
		]);
	}

	export() {
		this.loading = true;
		let url = this.globals.urls.assignments.exportResults;
		url = url.replace(":id", this.assignmentId()?.toString() ?? "");
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.httpService.showSuccess(
					response.message,
					"Export Results"
				);
				this.loading = false;
			},
			error: (error: any) => {
				this.httpService.showError(error, "Export Results");
				this.loading = false;
			},
		});
	}
}
