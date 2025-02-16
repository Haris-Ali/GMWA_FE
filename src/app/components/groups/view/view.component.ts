import { Component, inject, input } from "@angular/core";
import { HttpService } from "../../../../services/http.service";
import { globals } from "../../../../globals";
import { Router, RouterModule } from "@angular/router";
import { Group } from "../groups.type";
import { CommonModule } from "@angular/common";
import { Button } from "primeng/button";
import { UserService } from "../../../../services/user.service";

@Component({
	selector: "app-view",
	standalone: true,
	imports: [CommonModule, Button, RouterModule],
	providers: [HttpService],
	templateUrl: "./view.component.html",
	styleUrl: "./view.component.scss",
})
export class ViewComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private userService = inject(UserService);

	userRole = this.userService.getRole();

	globals = globals;

	groupId = input.required<number>();
	classroomId = input.required<number>();
	assignmentId = input.required<number>();

	group: Group | null = null;

	ngOnInit() {
		this.getData();
	}

	getData() {
		const url = this.globals.urls.groups.show.replace(
			":id",
			this.groupId().toString()
		);
		this.httpService.getRequest(url).subscribe({
			next: (response: any) => {
				this.group = {
					...response.group,
					enrolled_students: response.enrolled_students,
				};
			},
			error: (error) => {
				this.router.navigate([
					`/classrooms/${this.classroomId()}/assignments/${this.assignmentId()}`,
				]);
			},
		});
	}
}
