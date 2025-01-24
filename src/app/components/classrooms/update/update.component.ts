import { Component, inject, input, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
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

	name = new FormControl("", [Validators.required]);

	ngOnInit() {
		console.log(this.id());
		// this.classroomId = Number(this.route.snapshot.paramMap.get('id'));
		this.getClassroomDetails();
	}

	getClassroomDetails() {
		this.loading = true;
		this.name.disable();
		this.httpService
			.getRequest(`${this.globals.urls.classrooms.show}/${this.id}`)
			.subscribe({
				next: (response: any) => {
					this.name.setValue(response.name);
					this.loading = false;
				},
				error: (error) => {
					this.loading = false;
					this.router.navigate(["/classrooms"]);
				},
			});
	}

	updateClassroom() {
		if (this.name.invalid) return;

		this.loading = true;
		this.name.disable();
		this.httpService
			.putRequest(`${this.globals.urls.classrooms.update}/${this.id}`, {
				classroom: { name: this.name.value },
			})
			.subscribe({
				next: () => {
					this.loading = false;
					this.router.navigate(["/classrooms"]);
				},
				error: () => {
					this.loading = false;
					this.name.enable();
				},
			});
	}
}
