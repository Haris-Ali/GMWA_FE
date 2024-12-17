import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class HttpInterceptorService {
	private jwtToken: string = "";
	constructor() {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		this.jwtToken = JSON.parse(localStorage.getItem("jwtToken") || "{}");
		if (this.jwtToken) {
			req = req.clone({
				setHeaders: {
					Authorization: "Bearer " + this.jwtToken,
				},
			});
		}
		return next.handle(req);
	}
}
