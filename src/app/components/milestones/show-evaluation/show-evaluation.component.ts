import { Component, inject, input } from "@angular/core";
import { HttpService } from "../../../../services/http.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { globals } from "../../../../globals";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-show-evaluation",
	standalone: true,
	imports: [CommonModule, RouterModule],
	providers: [HttpService],
	templateUrl: "./show-evaluation.component.html",
	styleUrl: "./show-evaluation.component.scss",
})
export class ShowEvaluationComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);

	globals = globals;

	classroomId = input<any>();
	assignmentId = input<any>();
	groupingId = input<any>();

	milestoneId: any;

	loading: boolean = false;

	studentData: any;
	responseData: any;

	ngOnInit() {
		this.milestoneId = this.route.snapshot.queryParamMap.get("milestoneId");
		this.getData();
	}

	getData() {
		this.loading = true;
		let url = this.globals.urls.milestones.showEvaluation;
		url += `?grouping_id=${this.groupingId()}`;
		url = url.replace(":milestone_id", this.milestoneId);
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.studentData = response.grouping.enrollment;
				this.responseData = response;
			},
			error: (error: any) => {
				console.log(error);
			},
		});
	}

	getEvaluatorName(markedById: number): string {
		if (markedById === this.responseData.grouping.id) return "self (Self Assessment)";
		else {
			let marker = this.responseData.markings.find((marking: any) => marking.marked_by_id === markedById);
			return `${marker.marked_by.enrollment.student.first_name} ${marker.marked_by.enrollment.student.last_name}`
		}
	}

	getEvaluationKeys(evaluation: any): string[] {
		return Object.keys(evaluation);
	}

	getCriteria(name: string) {
		return (
			this.responseData.evaluation_criteria.find(
				(criteria: any) => criteria.name === name
			) || { min_value: "N/A", max_value: "N/A", weightage: "N/A" }
		);
	}
}
