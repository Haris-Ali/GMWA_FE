import { Component, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	ReactiveFormsModule,
	Validators,
	FormArray,
	FormBuilder,
} from "@angular/forms";
import { HttpService } from "../../../../services/http.service";
import { Router } from "@angular/router";
import { Button } from "primeng/button";
import { globals } from "../../../../globals";
import { InputTextModule } from "primeng/inputtext";
import { from } from "rxjs";
import { concatMap } from "rxjs";
import { finalize } from "rxjs";

@Component({
	selector: "app-add",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, Button, InputTextModule],
	providers: [HttpService],
	template: `
		<div class="heading mb-4">
			<h1 class="font-bold text-3xl">Enroll Students</h1>
		</div>
		<div class="bg-white rounded-border w-full p-4">
			<form
				[formGroup]="enrollmentForm"
				(ngSubmit)="addStudents()"
				class="flex flex-col gap-4"
			>
				<div formArrayName="students" class="flex flex-col gap-4">
					<div
						*ngFor="let student of students.controls; let i = index"
						[formGroupName]="i"
						class="flex flex-col md:flex-row gap-4 p-4 border rounded"
					>
						<div class="flex flex-col gap-2 flex-1">
							<label class="font-bold">Email</label>
							<input
								type="email"
								pInputText
								formControlName="student_email"
								class="p-2 border rounded"
								placeholder="student@example.com"
							/>
							<div
								*ngIf="
									student.get('student_email')?.invalid &&
									student.get('student_email')?.touched
								"
								class="text-red-600 text-sm"
							>
								<span
									*ngIf="student.get('student_email')?.errors?.['required']"
								>
									Email is required
								</span>
								<span
									*ngIf="student.get('student_email')?.errors?.['email']"
								>
									Invalid email format
								</span>
							</div>
						</div>

						<div class="flex flex-col gap-2">
							<label class="font-bold">Roll Number</label>
							<input
								type="number"
								pInputText
								formControlName="roll_number"
								class="p-2 border rounded w-32"
								placeholder="Roll No"
							/>
							<div
								*ngIf="
									student.get('roll_number')?.invalid &&
									student.get('roll_number')?.touched
								"
								class="text-red-600 text-sm"
							>
								<span
									*ngIf="student.get('roll_number')?.errors?.['required']"
								>
									Roll number is required
								</span>
								<span
									*ngIf="student.get('roll_number')?.errors?.['duplicate']"
								>
									Roll number must be unique
								</span>
							</div>
						</div>

						<p-button
							type="button"
							severity="danger"
							class="text-red-600 self-start mt-8"
							(click)="removeStudent(i)"
							*ngIf="students.length > 1"
						>
							Remove
						</p-button>
					</div>
				</div>

				<div class="flex gap-4">
					<p-button
						type="button"
						severity="secondary"
						class="text-gray-400 rounded-md"
						(click)="addNewStudent()"
					>
						Add Another Student
					</p-button>
				</div>

				<div class="flex gap-2 md:flex-row flex-col">
					<p-button
						type="button"
						severity="contrast"
						label="Back To Classroom"
						class="text-gray-400 rounded-md"
						(onClick)="goBackToClassroom()"
					></p-button>
					<p-button
						type="submit"
						label="Enroll Students"
						class="text-gray-400 rounded-md"
						[disabled]="loading || enrollmentForm.invalid"
					></p-button>
				</div>
			</form>
		</div>
	`,
})
export class EnrollmentsAddComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private _fb = inject(FormBuilder);

	globals = globals;
	loading: boolean = false;
	id = input.required<number>();

	enrollmentForm = this._fb.group({
		students: this._fb.array([]),
	});

	get students() {
		return this.enrollmentForm.get("students") as FormArray;
	}

	ngOnInit() {
		this.addNewStudent();
	}

	addNewStudent() {
		const studentForm = this._fb.group({
			student_email: ["", [Validators.required, Validators.email]],
			roll_number: ["", Validators.required],
		});
		this.students.push(studentForm);
		this.validateRollNumbers();
	}

	removeStudent(index: number) {
		this.students.removeAt(index);
		this.validateRollNumbers();
	}

	validateRollNumbers() {
		const rollNumbers = this.students.controls.map(
			(control: any) => control.get("roll_number")?.value
		);

		this.students.controls.forEach((control, index) => {
			const currentRoll = control.get("roll_number")?.value;
			const isDuplicate =
				rollNumbers.indexOf(currentRoll) !==
				rollNumbers.lastIndexOf(currentRoll);

			if (isDuplicate && currentRoll) {
				control.get("roll_number")?.setErrors({ duplicate: true });
			}
		});
	}

	addStudents() {
		if (this.enrollmentForm.invalid) return;

		const studentData = this.students.value;

		this.loading = true;
		const url = this.globals.urls.classrooms.enrollments.create.replace(
			":classroom_id",
			this.id().toString()
		);
		const enrollmentObs$ = studentData.map((student: any) => {
			return this.httpService.postRequest(url, {
				enrollment: {
					student_email: student.student_email,
					roll_number: student.roll_number,
				},
			});
		});

		from(enrollmentObs$)
			.pipe(
				concatMap((enrollment: any) => enrollment),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe({
				complete: () => {
					this.httpService.showSuccess(
						"Enrollment successfully created",
						"Enrollment"
					);
					this.goBackToClassroom();
				},
				error: () => {
					this.loading = false;
				},
			});
	}

	goBackToClassroom() {
		this.router.navigate([`/classrooms/${this.id()}`]);
	}
}
