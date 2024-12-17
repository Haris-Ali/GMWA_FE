import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	constructor(
		private http: HttpClient,
		private router: Router,
		private toastr: ToastrService
	) {}

	getRequest(url: string, params = {}, showerror = true) {
		return this.http.get(url, { params: params, observe: "response" }).pipe(
			map((res: any) => {
				if (res["response"] === 401) {
					this.handleUnauthenticated();
				} else if (
					res["status"] === 200 ||
					res["response"] === 200 ||
					res["response"] === 304 ||
					res["response"] === 400
				) {
					if (res.body["response"] === 401) {
						this.handleUnauthenticated();
					} else {
						return {
							data: res.body,
							response: res["status"],
						};
					}
				} else if (showerror) {
					throw new Error(res.body["message"]);
				}
				return {};
			}),
			catchError((err) => this.handleError(err) || of({}))
		);
	}

	postRequest(url: string, params = {}, headers = {}) {
		let httpOptions = this.checkHeaders(headers);

		return this.http.post(url, params, { headers: httpOptions }).pipe(
			map((res: any) => {
				if (res["message"]) throw new Error(res["message"]);
				else
					return {
						data: res,
					};
			}),
			catchError((err: any) => this.handleError(err) || of({}))
		);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			return throwError(
				() => new Error("An error occurred: " + error.error.message)
			);
		} else {
			if (error && error.status === 401) {
				localStorage.removeItem("user-data");
				localStorage.removeItem("jwtToken");
				this.router.navigateByUrl("/auth/login");
				return throwError(() => new Error("Unauthorized"));
			} else {
				if (error.status === 0) {
					console.error(
						`Request returned code ${error.status}, ` +
							`body was: ${error.error}`
					);
					return throwError(
						() => new Error("API Server is not responding.")
					);
				} else if (error.error && error.error.success === 0) {
					return throwError(() => new Error(error.error.message));
				} else if (error.error && error.error.message) {
					if (error.status === 400)
						this.showError(error.error.message);
					if (error.status === 403)
						this.showError(error.error.message);
					else
						this.showError(
							"You must be login to perform this action"
						);
					// this.showError(error.error.message);
				} else console.log(error);
			}
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
					`body was: ${error.error}`
			);
			return throwError(() => new Error(error.error.message));
		}
	}

	private checkHeaders(headers: {}) {
		if (Object.keys(headers).length) {
			return headers;
		} else
			return {
				"Content-Type": "application/json",
			};
	}

	handleUnauthenticated(msg: string = "") {
		if (msg) this.showError(msg);
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("user-data");
		return this.router.navigateByUrl("/auth/login");
	}

	showSuccess = (msg: string, title: string) => {
		this.toastr.success(msg, "", {
			closeButton: true,
			timeOut: 3000,
		});
	};

	showError = (msg: string, title: string = "") => {
		this.toastr.error(msg, title, {
			closeButton: true,
			timeOut: 3000,
		});
	};

	showInfo = (msg: string) => {
		this.toastr.info(msg, "", {
			closeButton: true,
			timeOut: 3000,
		});
	};
}
