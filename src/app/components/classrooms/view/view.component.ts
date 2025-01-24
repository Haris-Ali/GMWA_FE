import { Component, inject, input, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";
import { Button } from "primeng/button";
import { ClassroomDetails } from "../classrooms.types";

@Component({
	selector: "app-view",
	standalone: true,
	imports: [CommonModule, RouterModule, Button],
	templateUrl: "./view.component.html",
	styleUrl: "./view.component.scss",
})
export class ViewComponent implements OnInit {
	private router = inject(Router);
	private httpService = inject(HttpService);

	globals = globals;
	loading: boolean = false;
	id = input.required<number>();
	classroom: ClassroomDetails | null = null;

	ngOnInit() {
		this.getClassroomDetails();
	}

	getClassroomDetails() {
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

	viewStudents() {
		this.router.navigate([`/classrooms/${this.id()}/students`]);
	}

	viewAssignments() {
		this.router.navigate([`/classrooms/${this.id()}/assignments`]);
	}
}
