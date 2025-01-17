import { inject, Injectable } from "@angular/core";

import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from "@angular/router";

import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { HttpService } from "../services/http.service";
import { UserService } from "../services/user.service";

import { globals } from "../globals";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	httpService = inject(HttpService);
	userService = inject(UserService);
	router = inject(Router);

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		const storedData = localStorage.getItem("user-data");
		const user = storedData ? JSON.parse(storedData) : null;
		if (user !== null) return true;
		else {
			return this.httpService
				.getRequest(globals.urls.auth.currentUser)
				.pipe(
					map((user: any) => {
						if (user && user["response"] === 200 && user["data"]) {
							localStorage.setItem(
								"user-data",
								JSON.stringify(user["data"])
							);
							this.userService.loadUserData();
							return true;
						} else {
							localStorage.clear();
							this.userService.resetRole();
							this.router.navigate(["/auth/login"]);
							return false;
						}
					}),
					catchError(() => {
						this.router.navigate(["/auth/login"]);
						return of(false);
					})
				);
		}
	}
}
