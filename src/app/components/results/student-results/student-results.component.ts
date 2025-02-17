import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { TableComponent } from "../../table.component";
import { HttpService } from "../../../../services/http.service";
import { Router, RouterModule } from "@angular/router";
import { globals } from "../../../../globals";
import { WebAvaliaChartsComponent } from "../webavalia-charts/webavalia-charts.component";
import { QChartsComponent } from "../q-charts/q-charts.component";
import { Button } from "primeng/button";

@Component({
	selector: "app-student-results",
	standalone: true,
	imports: [
		CommonModule,
		TableComponent,
		WebAvaliaChartsComponent,
		QChartsComponent,
		RouterModule,
		Button,
	],
	providers: [HttpService],
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
		if (this.groupingId()) url += `?grouping_id=${this.groupingId()}`;
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
		if (this.assignment.evaluation_method === "Q") {
			this.tableColumns.push(
				{ header: "Contribution", field: "contribution" },
				{ header: "Rating", field: "rating" },
				{ header: "Final Score", field: "final_score" }
			);
		} else {
			milestones.forEach((milestone: any) => {
				this.tableColumns.push({
					header: `${milestone.name} (Weightage: ${milestone.weightage})`,
					field: `milestone_${milestone.id}`,
					...(this.groupingId() && {
						type: "link",
					}),
				});
			});

			this.tableColumns.push(
				{ header: "Milestones Mean", field: "milestones_mean" },
				{ header: "Final Score", field: "final_score" }
			);
		}
	}

	setupTableData(response: any) {
		const { result, groupings, milestones } = response;

		if (this.assignment.evaluation_method === "Q") {
			this.tableData = Object.entries(result.final_scores).map(
				([groupingKey, finalScore]) => {
					const groupingId = groupingKey.split("_")[1];
					const grouping = groupings.find(
						(g: any) => g.id.toString() === groupingId
					);

					return {
						student_id: grouping.enrollment.roll_number,
						student_name: `${grouping.enrollment.student.first_name} ${grouping.enrollment.student.last_name}`,
						contribution: parseFloat(
							result[`grouping_${groupingId}`].contribution
						).toFixed(2),
						rating: parseFloat(
							result[`grouping_${groupingId}`].rating
						).toFixed(2),
						final_score: parseFloat(finalScore as string).toFixed(
							2
						),
					};
				}
			);
		} else {
			this.tableData = Object.entries(result.final_scores).map(
				([groupingKey, finalScore]) => {
					const groupingId = groupingKey.split("_")[1];
					const grouping = groupings.find(
						(g: any) => g.id.toString() === groupingId
					);

					let weightedMilestonesMean = 0;

					const rowData: any = {
						student_id: grouping.enrollment_id,
						student_name: `${grouping.enrollment.student.first_name} ${grouping.enrollment.student.last_name}`,
						final_score: parseFloat(finalScore as string).toFixed(
							2
						),
					};

					milestones.forEach((milestone: any) => {
						const milestoneResult =
							result[`milestone_${milestone.id}`][
								`grouping_${groupingId}`
							];
						const totalScore = parseFloat(
							milestoneResult.total_score
						);
						weightedMilestonesMean +=
							totalScore * parseFloat(milestone.weightage);

						rowData[`milestone_${milestone.id}`] =
							totalScore.toFixed(2);
					});

					rowData.milestones_mean = weightedMilestonesMean.toFixed(2);

					return rowData;
				}
			);
		}
		this.totalRecords = this.tableData.length;
	}

	onRedirect(event: any) {
		let milestoneId: string = "";
		let groupingId = this.responseData.groupings.find(
			(d: any) => d.enrollment_id === event.student_id
		).id;
		for (const key in event) {
			if (key.startsWith("milestone_")) milestoneId = key.split("_")[1];
		}
		this.router.navigate(
			[
				"/classrooms",
				this.classroomId(),
				"assignments",
				this.assignmentId(),
				groupingId,
				"evaluations",
			],
			{
				queryParams: { milestoneId },
			}
		);
	}
}
