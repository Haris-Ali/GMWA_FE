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

@Component({
	selector: "app-add",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputText, Button, RouterModule],
	providers: [HttpService],
	templateUrl: "./add.component.html",
	styleUrl: "./add.component.scss",
})
export class AddComponent {
	private fb = inject(FormBuilder);
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;

	milestoneId = input.required<number>();
	assignmentId = input.required<number>();
	classroomId = input.required<number>();

	evaluationCriteriaForm: FormGroup = this.fb.group({
		name: ["", Validators.required],
		min_value: [0, [Validators.required]],
		max_value: [0, [Validators.required]],
		weightage: [0, [Validators.required, Validators.max(1.0)]],
	});

	loading: boolean = false;

	onSubmit() {
		this.loading = true;
		this.evaluationCriteriaForm.disable();
		const url = this.globals.urls.evaluation_criteria.create.replace(
			":milestone_id",
			this.milestoneId().toString()
		);
		this.httpService
			.postRequest(url, {
				evaluation_criterium: this.evaluationCriteriaForm.value,
			})
			.subscribe({
				next: (response: any) => {
					this.loading = false;
					this.router.navigate(['/classrooms', this.classroomId(), 'assignments', this.assignmentId(), 'milestones', this.milestoneId(), 'evaluation_criteria']);
				},
				error: (error: any) => {
					this.loading = false;
					this.evaluationCriteriaForm.enable();
					console.log(error);
				},
			});
	}
}
