import { Injectable } from "@angular/core";

import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from "@angular/router";

import { Observable, of } from "rxjs";
import { globals } from "../globals";
import { HttpService } from "../services/http.service";
import { map, catchError } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(private httpService: HttpService, private router: Router) {}

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
							return true;
						} else {
							localStorage.clear();
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
