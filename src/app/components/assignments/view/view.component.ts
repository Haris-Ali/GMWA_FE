import { Component, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../../../services/http.service";
import { Button } from "primeng/button";
import { Router, RouterModule } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { SelectButtonModule } from "primeng/selectbutton";
import { TextareaModule } from "primeng/textarea";
import { globals } from "../../../../globals";
import { Assignment } from "../assignments.type";
import { TagModule } from "primeng/tag";
import { ListComponent } from "../../milestones/list/list.component";
import { GroupsListComponent } from "../../groups/list/list.component";

@Component({
	selector: "app-view",
	standalone: true,
	imports: [
		CommonModule,
		InputTextModule,
		Button,
		SelectButtonModule,
		TextareaModule,
		RouterModule,
		TagModule,
		GroupsListComponent,
		ListComponent,
	],
	providers: [HttpService],
	templateUrl: "./view.component.html",
	styleUrl: "./view.component.scss",
})
export class ViewComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);

	globals = globals;

	loading: boolean = false;

	assignmentId = input.required<number>();
	classroomId = input.required<number>();

	assignment: Assignment | null = null;

	ngOnInit() {
		this.getData();
	}

	getData() {
		this.loading = true;
		let url = `${this.globals.urls.assignments.show}`;
		url = url.replace(":id", this.assignmentId().toString());
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.assignment = response.assignment;
				this.loading = false;
			},
			error: () => {
				this.loading = false;
				this.router.navigate([
					`/classrooms/${this.classroomId()}/assignments`,
				]);
			},
		});
	}
}
