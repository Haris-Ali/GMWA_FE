import { Injectable } from "@angular/core";
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	HttpParams,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
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

	getRequest<T>(endpoint: string, params?: HttpParams): Observable<T> {
		return this.http
			.get<T>(endpoint, { params })
			.pipe(catchError((error) => this.handleError(error)));
	}

	postRequest<T>(
		endpoint: string,
		body: any,
		headers?: HttpHeaders
	): Observable<T> {
		let httpHeaders = this.checkHeaders(headers);
		return this.http
			.post<T>(endpoint, body, { headers: httpHeaders })
			.pipe(catchError((error) => this.handleError(error)));
	}

	putRequest<T>(
		endpoint: string,
		body: any,
		headers?: HttpHeaders
	): Observable<T> {
		let httpHeaders = this.checkHeaders(headers);
		return this.http
			.put<T>(endpoint, body, { headers: httpHeaders })
			.pipe(catchError((error) => this.handleError(error)));
	}

	patchRequest<T>(
		endpoint: string,
		body: any,
		headers?: HttpHeaders
	): Observable<T> {
		let httpHeaders = this.checkHeaders(headers);
		return this.http
			.patch<T>(endpoint, body, { headers: httpHeaders })
			.pipe(catchError((error) => this.handleError(error)));
	}

	deleteRequest<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
		let httpHeaders = this.checkHeaders(headers);
		return this.http
			.delete<T>(endpoint, { headers: httpHeaders })
			.pipe(catchError((error) => this.handleError(error)));
	}

	private handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage: string = "An unknown error occurred";
		console.log(error);
		if (error.error instanceof ErrorEvent) {
			errorMessage = `Client-side error: ${error.error.message}`;
		} else {
			if (error.status === 401) {
				errorMessage = "Your session has expired. Please log in again.";
				this.handleUnauthenticated(errorMessage);
			} else {
				errorMessage = `Server-side error: ${error.status} - ${error.message}`;
				this.showError(errorMessage);
			}
		}
		console.error(errorMessage);
		return throwError(() => new Error(errorMessage));
	}

	private checkHeaders(headers?: HttpHeaders): HttpHeaders {
		if (headers && Object.keys(headers.keys()).length > 0) {
			return headers;
		} else
			return new HttpHeaders({
				"Content-Type": "application/json",
			});
	}

	handleUnauthenticated(msg: string = "") {
		if (msg) this.showError(msg);
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("user-data");
		this.router.navigateByUrl("/auth/login");
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
