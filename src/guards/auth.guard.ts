import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "../services/http.service";
import { UserService } from "../services/user.service";
import { globals } from "../globals";
import { MessageService } from "primeng/api";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";

export const authGuard = () => {
	const httpService = inject(HttpService);
	const userService = inject(UserService);
	const router = inject(Router);
	const messageService = inject(MessageService);

	const storedData = localStorage.getItem("user-data");
	const user = storedData ? JSON.parse(storedData) : null;

	if (user !== null) return true;
	else {
		return httpService.getRequest(globals.urls.auth.currentUser).pipe(
			map((response: any) => {
				console.log("response: ", response);
				if (response?.response === 200 && response?.data) {
					localStorage.setItem(
						"user-data",
						JSON.stringify(response.data)
					);
					userService.loadUserData();
					return true;
				}
				handleAuthFailure(router, userService, messageService);
				return false;
			}),
			catchError(() => {
				handleAuthFailure(router, userService, messageService);
				return of(false);
			})
		);
	}
};

const handleAuthFailure = (
	router: Router,
	userService: UserService,
	messageService: MessageService
) => {
	localStorage.clear();
	userService.resetRole();
	messageService.add({
		severity: "error",
		summary: "Authentication Required",
		detail: "Please log in to continue",
	});
	router.navigate(["/auth/login"]);
};
