import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "./service/app.layout.service";
import { AppMenuitemComponent } from "./app.menuitem.component";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-menu",
	standalone: true,
	imports: [CommonModule, AppMenuitemComponent],
	providers: [LayoutService],
	templateUrl: "./app.menu.component.html",
})
export class AppMenuComponent implements OnInit {
	model: any[] = [];

	constructor(public layoutService: LayoutService) {}

	ngOnInit() {
		const storedData = localStorage.getItem("user-data");
		const user = storedData ? JSON.parse(storedData) : null;
		this.model = [
			{
				label: "Home",
				items: [
					{
						label: "Dashboard",
						icon: "pi pi-fw pi-home",
						routerLink: ["/"],
					},
				],
			},
			{
				label: "Invitations",
				items: [
					{
						label: "Invite Users",
						icon: "pi pi-fw pi-envelope",
						routerLink: ["/invitation/invite-user"],
					},
					{
						label: "Invitations List",
						icon: "pi pi-fw pi-list",
						routerLink: ["/invitation/list"],
					},
				],
				// visible: user.role === "teacher",
			},
			{
				label: "Classrooms",
				items: [
					{
						label: "Classrooms List",
						icon: "pi pi-fw pi-list",
						routerLink: ["/classroom/list"],
					},
					{
						label: "New Classroom",
						icon: "pi pi-fw pi-folder-plus",
						routerLink: ["/classroom/new"],
						// visible: user.role === "teacher",
					},
					{
						label: "Test Classroom",
						icon: "pi pi-fw pi-clone",
						routerLink: ["/classroom/test"],
						// visible: user.role === "teacher",
					},
				],
			},
			{
				label: "Assignments",
				items: [
					{
						label: "Assignments List",
						icon: "pi pi-fw pi-file",
						routerLink: ["/assignment/list"],
					},
					{
						label: "New Assignment",
						icon: "pi pi-fw pi-file-plus",
						routerLink: ["/assignment/new"],
					},
				],
			},
		];
	}
}
