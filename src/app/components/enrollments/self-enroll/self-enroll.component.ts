import { Component, inject, input } from "@angular/core";
import { HttpService } from "../../../../services/http.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormControl, Validators } from "@angular/forms";
import { ClassroomDetails } from "../../classrooms/classrooms.types";
import { globals } from "../../../../globals";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";

@Component({
	selector: "app-self-enroll",
	standalone: true,
	imports: [CommonModule, Button, InputText],
	providers: [HttpService],
	templateUrl: "./self-enroll.component.html",
	styleUrl: "./self-enroll.component.scss",
})
export class SelfEnrollComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;

	id = input.required<number>();
	rollNumber = new FormControl("", [Validators.required]);

	classroom: ClassroomDetails | null = null;
	loading: boolean = false;

	ngOnInit() {
		this.getData();
	}

	getData() {
		this.loading = true;
		let url = `${this.globals.urls.classrooms.show}`;
		url = url.replace(":id", this.id().toString());
		this.httpService.getRequest<any>(url).subscribe({
			next: (response) => {
				this.classroom = {
					...response.classroom,
					teacher_name: response.teacher_name,
					enrolled_students: response.enrolled_students,
					assignments: response.assignments,
				};
				this.loading = false;
			},
			error: (error) => {
				this.loading = false;
				this.router.navigate(["/classrooms"]);
			},
		});
	}

	selfEnroll() {
		this.loading = true;
		let url =
			this.globals.urls.classrooms.enrollments.submitSelfEnroll.replace(
				":classroom_id",
				this.id().toString()
			);
		const storedData = localStorage.getItem("user-data");
		const user = storedData ? JSON.parse(storedData) : null;
		let params = {
			enrollment: {
				roll_number: this.rollNumber.value,
				student_email: user?.email,
			},
		};
		this.httpService.postRequest(url, params).subscribe({
			next: (response: any) => {
				this.loading = false;
				this.httpService.showSuccess(
					response.message,
					"Self Enrollment Successful"
				);
				this.router.navigate(["/classrooms"]);
			},
			error: (error) => {
				this.httpService.showError("Self Enrollment Failed");
				this.loading = false;
			},
		});
	}
}
