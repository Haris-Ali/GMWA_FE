import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";

import { InputTextModule } from "primeng/inputtext";
import { Button } from "primeng/button";

@Component({
	selector: "app-add",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		InputTextModule,
		Button,
	],
	providers: [HttpService],
	templateUrl: "./add.component.html",
	styleUrl: "./add.component.scss",
})
export class AddComponent {
	router = inject(Router);
	httpService = inject(HttpService);

	globals = globals;
	loading: boolean = false;

	addClassroomForm = new FormGroup({
		name: new FormControl("", [Validators.required]),
	});

	addClassroom(addClassroomForm: FormGroup) {
		console.log(addClassroomForm.value);
		this.loading = true;
		addClassroomForm.disable();
		this.httpService
			.postRequest(this.globals.urls.classrooms.create, {
				classroom: { name: addClassroomForm.value.name },
			})
			.subscribe({
				next: (response: any) => {
					this.loading = false;
					addClassroomForm.enable();
					this.httpService.showSuccess(
						response.message,
						"Classroom Added"
					);
					this.router.navigate(["/classrooms"]);
				},
				error: (error) => {
					this.loading = false;
					addClassroomForm.enable();
				},
			});
	}
}
