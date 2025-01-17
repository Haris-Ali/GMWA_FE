import { Injectable, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private userRole = signal<string | null>(null);

	constructor() {}

	loadUserData() {
		const userData = localStorage.getItem("user-data");
		if (userData) {
			const { role } = JSON.parse(userData);
			this.userRole.set(role);
		}
	}

	getRole() {
		return this.userRole();
	}

	resetRole() {
		this.userRole.set(null);
	}
}
