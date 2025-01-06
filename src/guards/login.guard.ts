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
		const user = JSON.parse(localStorage.getItem("user-data") || "{}");
		if (user !== null) {
			this.router.navigate(["/dashboard"]);
			return false;
		} else {
			return true;
		}
	}
}
