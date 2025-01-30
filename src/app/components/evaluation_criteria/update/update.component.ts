import { Component, inject, input } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";
import { CommonModule } from "@angular/common";
import { InputText } from "primeng/inputtext";
import { Button } from "primeng/button";
import { EvaluationCriteria } from "../evaluationCriteria.type";

@Component({
	selector: "app-update",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputText,
		Button,
		RouterModule,
	],
	providers: [HttpService],
	templateUrl: "./update.component.html",
	styleUrl: "./update.component.scss",
})
export class UpdateComponent {
	private fb = inject(FormBuilder);
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;

	evaluationCriteriaId = input.required<number>();
	milestoneId = input.required<number>();
	assignmentId = input.required<number>();
	classroomId = input.required<number>();

	evaluationCriteria!: EvaluationCriteria;

	evaluationCriteriaForm: FormGroup = this.fb.group({
		name: ["", Validators.required],
		min_value: [0, [Validators.required]],
		max_value: [0, [Validators.required]],
		weightage: [0, [Validators.required, Validators.max(1.0)]],
	});

	loading: boolean = false;

	ngOnInit() {
		this.getData();
	}

	getData() {
		this.loading = true;
		const url = this.globals.urls.evaluation_criteria.show.replace(
			":id",
			this.evaluationCriteriaId().toString()
		);
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.evaluationCriteria = response.evaluation_criterium;
				this.evaluationCriteriaForm.setValue({
					name: this.evaluationCriteria.name,
					min_value: this.evaluationCriteria.min_value,
					max_value: this.evaluationCriteria.max_value,
					weightage: this.evaluationCriteria.weightage,
				});
				this.loading = false;
			},
			error: (error: any) => {
				this.loading = false;
				this.router.navigate([
					"/classrooms",
					this.classroomId(),
					"assignments",
					this.assignmentId(),
					"milestones",
					this.milestoneId(),
					"evaluation_criteria",
				]);
			},
		});
	}

	onSubmit() {
		this.loading = true;
		this.evaluationCriteriaForm.disable();
		const url = this.globals.urls.evaluation_criteria.update.replace(
			":id",
			this.evaluationCriteriaId().toString()
		);
		this.httpService
			.putRequest(url, {
				evaluation_criterium: this.evaluationCriteriaForm.value,
			})
			.subscribe({
				next: (response: any) => {
					this.loading = false;
					this.router.navigate([
						"/classrooms",
						this.classroomId(),
						"assignments",
						this.assignmentId(),
						"milestones",
						this.milestoneId(),
						"evaluation_criteria",
					]);
				},
				error: (error: any) => {
					this.loading = false;
					this.evaluationCriteriaForm.enable();
					console.log(error);
				},
			});
	}
}
