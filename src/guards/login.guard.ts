import { Injectable } from "@angular/core";

import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from "@angular/router";

import { Observable, of } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class LoginGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		const storedData = localStorage.getItem("user-data");
		const user = storedData ? JSON.parse(storedData) : null;
		if (user !== null) {
			this.router.navigate(["/dashboard"]);
			return false;
		} else {
			return true;
		}
	}
}
