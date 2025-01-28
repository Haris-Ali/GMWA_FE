import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Button } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { HttpService } from "../../../../services/http.service";
import { Router, RouterModule } from "@angular/router";
import { globals } from "../../../../globals";

@Component({
	selector: "app-add",
	standalone: true,
	imports: [
		DatePickerModule,
		InputNumberModule,
		InputTextModule,
		Button,
		ReactiveFormsModule,
		CommonModule,
		RouterModule,
	],
	providers: [HttpService],
	templateUrl: "./add.component.html",
	styleUrl: "./add.component.scss",
})
export class AddComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private _fb: FormBuilder = inject(FormBuilder);

	assignmentId = input.required<number>();
	classroomId = input.required<number>();

	globals = globals;

	milestoneForm: FormGroup = this._fb.group({
		name: ["", [Validators.required]],
		weightage: ["", [Validators.required, Validators.min(0)]],
		dead_line: ["", [Validators.required]],
	});
	minDate: Date = new Date();

	loading: boolean = false;

	onSubmit() {
		this.loading = true;
		this.milestoneForm.disable();
		const url = this.globals.urls.milestones.create.replace(
			":id",
			this.assignmentId().toString()
		);

		this.httpService
			.postRequest(url, {
				milestone: this.milestoneForm.value,
			})
			.subscribe({
				next: (response: any) => {
					this.loading = false;
					this.milestoneForm.enable();
					this.httpService.showSuccess(
						response.message,
						"Milestone Added"
					);
					this.router.navigate([
						`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}`,
					]);
				},
				error: () => {
					this.loading = false;
					this.milestoneForm.enable();
				},
			});
	}
}
