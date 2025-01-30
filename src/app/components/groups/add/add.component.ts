import { Component, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	FormControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidatorFn,
	Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";
import { Assignment } from "../../assignments/assignments.type";
import { HttpParams } from "@angular/common/http";
import { InputNumberModule } from "primeng/inputnumber";
import { Button } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { fieldConfig } from "../groups.type";
import { Select } from "primeng/select";
import { Checkbox } from "primeng/checkbox";
import { SnakeToSpacePipe } from "../../../../pipes/snakecase-to-space.pipe";

@Component({
	selector: "app-add",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputNumberModule,
		Button,
		RouterModule,
		MultiSelectModule,
		InputTextModule,
		Select,
		Checkbox,
		SnakeToSpacePipe,
	],
	providers: [HttpService],
	templateUrl: "./add.component.html",
	styleUrl: "./add.component.scss",
})
export class AddComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private _fb = inject(FormBuilder);

	assignmentId = input.required<number>();
	classroomId = input.required<number>();

	globals = globals;

	enrolledStudents: any[] = [];
	assignment: Assignment | null = null;
	groupForm!: FormGroup;

	loading: boolean = false;
	Validators = Validators;

	ngOnInit() {
		this.initForm();
		this.getData();
		this.getEnrolledStudents();
	}

	initForm() {
		this.groupForm = this._fb.group({
			name: ["", Validators.required],
			marks: [0, [Validators.required, Validators.min(0)]],
			enrollment_ids: [[], Validators.required],
			setting: this._fb.group({}),
		});
	}

	addSettings() {
		const fields =
			this.assignment?.evaluation_method === "WebAvalia"
				? this.getWebAvaliaFields()
				: this.getQFields();

		const settingsGroup = this.groupForm.get("setting") as FormGroup;
		Object.entries(fields).forEach(([field, config]) => {
			const validators: ValidatorFn[] = config.editable
				? [Validators.required]
				: [];

			if (config.type === "double") {
				if (config.min !== undefined)
					validators.push(Validators.min(config.min));
				if (config.max !== undefined)
					validators.push(Validators.max(config.max));
			}

			let defaultValue: any;
			switch (config.type) {
				case "boolean":
					defaultValue = false;
					break;
				case "double":
					defaultValue = 0;
					break;
				case "selection":
					defaultValue = config.options?.[0] || "";
					break;
			}

			settingsGroup.addControl(
				field,
				new FormControl(
					{ value: defaultValue, disabled: !config.editable },
					validators
				)
			);
		});
	}

	getSettingsControls() {
		return (this.groupForm.get("setting") as FormGroup)?.controls;
	}

	getWebAvaliaFields(): { [key: string]: fieldConfig } {
		return {
			self_assessment: {
				type: "boolean",
				editable: true,
			},
			self_assessment_weightage: {
				type: "double",
				min: 0,
				max: 1,
				editable: true,
			},
			written_feedback: {
				type: "selection",
				options: ["optional", "none", "required"],
				editable: false,
			},
		};
	}

	getQFields(): { [key: string]: fieldConfig } {
		return {
			tolerance: {
				type: "double",
				min: 0,
				max: 1,
				editable: true,
			},
			impact: {
				type: "double",
				min: 0,
				max: 1,
				editable: true,
			},
			self_assessment: {
				type: "boolean",
				editable: false,
			},
			written_feedback: {
				type: "selection",
				options: ["optional", "none", "required"],
				editable: true,
			},
		};
	}

	getData() {
		let url = `${this.globals.urls.assignments.show}`;
		url = url.replace(":id", this.assignmentId().toString());
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.assignment = response.assignment;
				const totalMarks = parseFloat(
					this.assignment?.total_marks ?? "50"
				);
				this.groupForm
					.get("marks")
					?.setValidators([
						Validators.required,
						Validators.min(0),
						Validators.max(totalMarks),
					]);
				if (this.assignment?.evaluation_method) this.addSettings();
			},
			error: () => {
				this.router.navigate([
					`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}`,
				]);
			},
		});
	}

	getEnrolledStudents() {
		let params = new HttpParams();
		let url = this.globals.urls.classrooms.enrollments.list;
		url = url.replace(":classroom_id", this.classroomId().toString());
		this.httpService.getRequest(url, params).subscribe({
			next: (response: any) => {
				this.enrolledStudents = response.enrollments;
			},
			error: () => {
				this.router.navigate([
					`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}`,
				]);
			},
		});
	}

	onSubmit() {
		this.loading = true;
		this.groupForm.disable();
		const url = this.globals.urls.groups.create.replace(
			":id",
			this.assignmentId().toString()
		);

		this.httpService
			.postRequest(url, {
				group: this.groupForm.getRawValue(),
			})
			.subscribe({
				next: (response: any) => {
					this.loading = false;
					this.groupForm.enable();
					this.httpService.showSuccess(
						response.message,
						"Group Added"
					);
					this.router.navigate([
						`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}`,
					]);
				},
				error: () => {
					this.loading = false;
					this.groupForm.enable();
				},
			});
	}

	getFieldConfig(fieldName: string): fieldConfig | undefined {
		const fields =
			this.assignment?.evaluation_method === "WebAvalia"
				? this.getWebAvaliaFields()
				: this.getQFields();
		return fields[fieldName];
	}
}
