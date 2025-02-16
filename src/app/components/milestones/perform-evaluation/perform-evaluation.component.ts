import { Component, inject, input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { HttpService } from "../../../../services/http.service";
import { UserService } from "../../../../services/user.service";
import { globals } from "../../../../globals";
import { EvaluationData, MarkingWithEnrollment } from "../milestones.type";
import {
	FormBuilder,
	FormGroup,
	FormArray,
	ReactiveFormsModule,
	Validators,
	FormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputNumber } from "primeng/inputnumber";
import { TextareaModule } from "primeng/textarea";
import { Button } from "primeng/button";
import { AccordionModule } from "primeng/accordion";

@Component({
	selector: "app-perform-evaluation",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		InputNumber,
		TextareaModule,
		Button,
		RouterModule,
		AccordionModule,
	],
	templateUrl: "./perform-evaluation.component.html",
	styleUrl: "./perform-evaluation.component.scss",
})
export class PerformEvaluationComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private userService = inject(UserService);
	private fb = inject(FormBuilder);

	userRole = this.userService.getRole();
	globals = globals;

	milestoneId = input.required<number>();
	assignmentId = input.required<number>();
	classroomId = input.required<number>();

	loading: boolean = false;

	evaluationData: EvaluationData = {
		markings: [],
		evaluation_criteria: [],
		feedback: "",
	};

	evaluationForm!: FormGroup;

	storedData = localStorage.getItem("user-data");
	user: any;

	ngOnInit() {
		this.user = this.storedData ? JSON.parse(this.storedData) : null;
		this.getData();
		this.initForm();
	}

	getData() {
		this.loading = true;
		const url = this.globals.urls.milestones.performEvaluation.replace(
			":milestone_id",
			this.milestoneId().toString()
		);

		this.httpService.getRequest(url).subscribe({
			next: (res: any) => {
				this.loading = false;
				this.evaluationData = res;
				console.log(this.evaluationData);
				this.initializeMarkings();
			},
			error: (err: any) => {
				this.loading = false;
				this.router.navigate([
					"/classrooms",
					this.classroomId(),
					"assignments",
					this.assignmentId(),
				]);
			},
		});
	}

	initForm() {
		this.evaluationForm = this.fb.group({
			markings: this.fb.array([]),
		});
	}

	createMarkingFormGroup(marking: MarkingWithEnrollment) {
		const criteriaControls: { [key: string]: any } = {};

		this.evaluationData.evaluation_criteria.forEach((criterion) => {
			const formGroup: any = {
				score: [
					"",
					[
						Validators.required,
						Validators.min(parseFloat(criterion.min_value)),
						Validators.max(parseFloat(criterion.max_value)),
					],
				],
				...(this.evaluationData.feedback !== "none" && {
					feedback: [
						"",
						this.evaluationData.feedback === "required"
							? [Validators.required]
							: [],
					],
				}),
			};
			criteriaControls[`criterion_${criterion.id}`] =
				this.fb.group(formGroup);
		});

		return this.fb.group({
			markingId: [marking.marking.id],
			markedById: [marking.marking.marked_by_id],
			markedForId: [marking.marking.marked_for_id],
			enrollmentId: [marking.enrollment.id],
			rollNumber: [marking.enrollment.roll_number],
			...criteriaControls,
		});
	}

	get markingsFormArray() {
		return this.evaluationForm.get("markings") as FormArray;
	}

	initializeMarkings() {
		while (this.markingsFormArray.length) {
			this.markingsFormArray.removeAt(0);
		}

		this.evaluationData.markings.forEach((marking) => {
			this.markingsFormArray.push(this.createMarkingFormGroup(marking));
		});
	}

	onSubmit() {
		this.loading = true;
		const url = this.globals.urls.milestones.submitEvaluation.replace(
			":milestone_id",
			this.milestoneId().toString()
		);

		const formValue = this.evaluationForm.value;
		const transformedData = {
			markings: formValue.markings.map((marking: any) => {
				const evaluation: { [key: string]: string } = {};
				this.evaluationData.evaluation_criteria.forEach((criterion) => {
					const criterionControl =
						marking[`criterion_${criterion.id}`];
					evaluation[criterion.name] = criterionControl.score;
					if (criterionControl.feedback) {
						evaluation.feedback = criterionControl.feedback;
					}
				});

				return {
					marked_by_id: marking.markedById,
					marked_for_id: marking.markedForId,
					evaluation: evaluation,
				};
			}),
		};

		this.httpService.postRequest(url, transformedData).subscribe({
			next: (res: any) => {
				this.loading = false;
				this.httpService.showSuccess(res.message, "Evaluation");
				this.router.navigate([
					"/classrooms",
					this.classroomId(),
					"assignments",
					this.assignmentId(),
				]);
			},
			error: (err: any) => {
				this.loading = false;
				this.httpService.showError(err.message, "Evaluation");
			},
		});
	}
}
