import { inject, Injectable } from "@angular/core";
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	HttpParams,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

@Injectable({
	providedIn: "root",
})
export class HttpService {
	http = inject(HttpClient);
	router = inject(Router);
	messageService = inject(MessageService);

	getRequest<T>(endpoint: string, params?: HttpParams): Observable<T> {
		return this.http
			.get<T>(endpoint, { params })
			.pipe(catchError((error) => this.handleError(error)));
	}

	postRequest<T>(
		endpoint: string,
		body: any,
		headers?: HttpHeaders,
		setHeaders: boolean = false
	): Observable<T> {
		let httpHeaders = setHeaders ? undefined : this.checkHeaders(headers);
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
		let errorMessage: any = "An unknown error occurred";
		if (error.error instanceof ErrorEvent) {
			errorMessage = `Client-side error: ${error.error.message}`;
		} else {
			console.log(error);
			if (error.status === 401) {
				errorMessage = "Your session has expired. Please log in again.";
				this.handleUnauthenticated(errorMessage);
			}
			if (error.status === 422) {
				let tempError = error.error.errors
					? error.error.errors
					: error.error;
				errorMessage = this.formatErrorMessage(tempError);
				this.showError(errorMessage);
			} else if (error.status === 403) {
				errorMessage = error.error.error;
				this.showError(errorMessage);
			} else {
				errorMessage = `Server-side error: ${error.status} - ${
					error.error
						? error.error.message || error.error.error
						: error.message
				}`;
				this.showError(errorMessage);
			}
		}
		return throwError(() => new Error(errorMessage));
	}

	private formatErrorMessage = (errors: any) => {
		if (typeof errors === "string") return errors;
		if (typeof errors === "object" && errors !== null) {
			return Object.entries(errors)
				.map(([field, messages]) => {
					if (Array.isArray(messages))
						return `${messages.join(". ")}`;
					return `${field} ${messages}`;
				})
				.join(". ");
		}
		return "An unknown error occurred";
	};

	private checkHeaders(headers?: HttpHeaders): HttpHeaders {
		if (headers && Object.keys(headers.keys()).length > 0) {
			return headers;
		} else
			return new HttpHeaders({
				"Content-Type": "application/json",
				Accept: "application/json",
			});
	}

	handleUnauthenticated(msg: string = "") {
		if (msg) this.showError(msg);
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("user-data");
		this.router.navigateByUrl("/auth/login");
	}

	showSuccess = (msg: string, title: string) => {
		this.messageService.add({
			severity: "success",
			summary: title || "Success",
			detail: msg,
			life: 3000,
		});
	};

	showError = (msg: string, title: string = "") => {
		this.messageService.add({
			severity: "error",
			summary: title || "Error",
			detail: msg,
			life: 3000,
		});
	};

	showInfo = (msg: string) => {
		this.messageService.add({
			severity: "info",
			summary: "Info",
			detail: msg,
			life: 3000,
		});
	};
}
