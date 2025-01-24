import { Component, inject, input, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";

import { InputTextModule } from "primeng/inputtext";
import { Button } from "primeng/button";

@Component({
	selector: "app-update",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		InputTextModule,
		Button,
	],
	providers: [HttpService],
	templateUrl: "./update.component.html",
	styleUrl: "./update.component.scss",
})
export class UpdateComponent implements OnInit {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private httpService = inject(HttpService);

	globals = globals;
	loading: boolean = false;
	id = input.required<number>();

	updateClassroomForm = new FormGroup({
		name: new FormControl("", [Validators.required]),
	});

	ngOnInit() {
		console.log(this.id());
		this.getClassroomDetails();
	}

	getClassroomDetails() {
		this.loading = true;
		let url = `${this.globals.urls.classrooms.show}`;
		url = url.replace(":id", this.id().toString());
		this.httpService
			.getRequest(url)
			.subscribe({
				next: (response: any) => {
					this.updateClassroomForm.setValue({
						name: response.classroom.name,
					});
					this.loading = false;
				},
				error: (error) => {
					this.loading = false;
					this.router.navigate(["/classrooms"]);
				},
			});
	}

	updateClassroom() {
		if (this.updateClassroomForm.invalid) return;

		this.loading = true;
		this.updateClassroomForm.disable();
		let url = `${this.globals.urls.classrooms.update}`;
		url = url.replace(":id", this.id().toString());
		this.httpService
			.putRequest(url, {
				classroom: { name: this.updateClassroomForm.value.name },
			})
			.subscribe({
				next: (response: any) => {
					console.log(response);
					this.httpService.showSuccess(response.message, "Classroom Updated");
					this.loading = false;
					this.router.navigate(["/classrooms"]);
				},
				error: () => {
					this.loading = false;
					this.updateClassroomForm.enable();
				},
			});
	}
}
