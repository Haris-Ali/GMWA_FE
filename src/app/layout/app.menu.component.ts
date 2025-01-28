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
						routerLink: ["/dashboard"],
					},
				],
			},
			{
				label: "Registrations",
				items: [
					{
						label: "Registrations",
						icon: "pi pi-fw pi-list",
						routerLink: ["/registrations"],
					},
				],
				visible: user.role === "super_admin",
			},
			{
				label: "Invitations",
				items: [
					{
						label: "Invite Users",
						icon: "pi pi-fw pi-envelope",
						routerLink: ["/invitations/new"],
					},
					{
						label: "Invitations List",
						icon: "pi pi-fw pi-list",
						routerLink: ["/invitations"],
					},
				],
				visible: user.role === "teacher" || user.role === "super_admin",
			},
			{
				label: "Classrooms",
				items: [
					{
						label: "My Classrooms",
						icon: "pi pi-fw pi-list",
						routerLink: ["/classrooms"],
					},
					{
						label: "Add Classroom",
						icon: "pi pi-fw pi-folder-plus",
						routerLink: ["/classrooms/add"],
						visible: user.role === "teacher",
					},
					{
						label: "Test Classroom",
						icon: "pi pi-fw pi-clone",
						routerLink: ["/classrooms/1"],
						visible: user.role === "teacher",
					},
				],
			},
		];
	}
}
