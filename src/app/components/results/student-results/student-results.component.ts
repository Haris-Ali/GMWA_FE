import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { TableComponent } from "../../table.component";
import { HttpService } from "../../../../services/http.service";
import { Router } from "@angular/router";
import { globals } from "../../../../globals";
import { PerformanceChartsComponent } from "../performance-charts/performance-charts.component";

@Component({
	selector: "app-student-results",
	standalone: true,
	imports: [CommonModule, TableComponent, PerformanceChartsComponent],
	templateUrl: "./student-results.component.html",
	styleUrl: "./student-results.component.scss",
})
export class StudentResultsComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;
	classroomId = input<number>();
	assignmentId = input<number>();
	groupingId = input<number>();

	tableColumns: any[] = [
		{ header: "Student ID", field: "student_id" },
		{ header: "Student Name", field: "student_name" },
	];

	tableData: any[] = [];

	page = 1;
	first = 0;
	totalRecords = 0;
	loading: boolean = false;

	assignment: any;
	responseData: any;

	ngOnInit() {
		this.getData();
	}

	getData() {
		this.loading = true;
		let url = this.globals.urls.assignments.calculateMarks;
		url += `?grouping_id=${this.groupingId()}`;
		url = url.replace(":id", this.assignmentId()?.toString() ?? "");
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.responseData = response;
				this.assignment = response.assignment;
				this.setupTableColumns(response.milestones);
				this.setupTableData(response);
				this.loading = false;
			},
			error: () => {
				this.loading = false;
			},
		});
	}

	setupTableColumns(milestones: any) {
		this.tableColumns = [
			{ header: "Student ID", field: "student_id" },
			{ header: "Student Name", field: "student_name" },
		];

		milestones.forEach((milestone: any) => {
			console.log(milestone);
			this.tableColumns.push({
				header: `${milestone.name} (Weightage: ${milestone.weightage})`,
				field: `milestone_${milestone.id}`,
			});
		});

		this.tableColumns.push(
			{ header: "Milestones Mean", field: "milestones_mean" },
			{ header: "Final Score", field: "final_score" }
		);
	}

	setupTableData(response: any) {
		const { result, groupings, milestones } = response;

		this.tableData = Object.entries(result.final_scores).map(
			([groupingKey, finalScore]) => {
				const groupingId = groupingKey.split("_")[1];
				const grouping = groupings.find(
					(g: any) => g.id.toString() === groupingId
				);

				// Calculate weighted milestones mean
				let weightedMilestonesMean = 0;

				// Base student data
				const rowData: any = {
					student_id: grouping.enrollment_id,
					student_name: `${grouping.enrollment.student.first_name} ${grouping.enrollment.student.last_name}`,
					final_score: parseFloat(finalScore as string).toFixed(2),
				};

				// Add milestone scores
				milestones.forEach((milestone: any) => {
					const milestoneResult =
						result[`milestone_${milestone.id}`][
							`grouping_${groupingId}`
						];
					const totalScore = parseFloat(milestoneResult.total_score);
					weightedMilestonesMean +=
						totalScore * parseFloat(milestone.weightage);

					rowData[`milestone_${milestone.id}`] =
						totalScore.toFixed(2);
				});

				rowData.milestones_mean = weightedMilestonesMean.toFixed(2);

				return rowData;
			}
		);
		this.totalRecords = this.tableData.length;
	}
}
