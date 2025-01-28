import { Component, OnInit, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../../../services/http.service";
import { Button } from "primeng/button";
import { Router, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SelectButtonModule } from "primeng/selectbutton";
import { TextareaModule } from "primeng/textarea";
import { globals } from "../../../../globals";

@Component({
	selector: "app-assignment-add",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		Button,
		SelectButtonModule,
		TextareaModule,
		RouterModule,
	],
	providers: [HttpService],
	templateUrl: "./add.component.html",
})
export class AddComponent implements OnInit {
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;

	classroomId = input.required<number>();

	loading: boolean = false;

	evaluationMethods: any[] = [
		{ label: "WebAVALIA", value: "WebAvalia" },
		{ label: "QASS", value: "Q" },
	];

	assignmentForm = new FormGroup({
		name: new FormControl("", [Validators.required]),
		description: new FormControl(""),
		evaluation_method: new FormControl("", [Validators.required]),
		total_marks: new FormControl(100, [
			Validators.required,
			Validators.min(1),
		]),
	});

	ngOnInit() {}

	onSubmit() {
		this.loading = true;
		this.assignmentForm.disable();
		const url =
			this.globals.urls.assignments.newClassroomAssignment.replace(
				":classroom_id",
				this.classroomId().toString()
			);

		this.httpService
			.postRequest(url, {
				assignment: this.assignmentForm.value,
			})
			.subscribe({
				next: (response: any) => {
					this.loading = false;
					this.assignmentForm.enable();
					this.httpService.showSuccess(
						response.message,
						"Assignment Added"
					);
					this.goBack();
				},
				error: () => {
					this.loading = false;
					this.assignmentForm.enable();
				},
			});
	}

	goBack() {
		this.router.navigate([`/classrooms/${this.classroomId()}`]);
	}
}
