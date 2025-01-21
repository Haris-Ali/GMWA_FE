import { inject } from "@angular/core";

import { Router } from "@angular/router";

export const loginGuard = () => {
	const router = inject(Router);

	const storedData = localStorage.getItem("user-data");
	const user = storedData ? JSON.parse(storedData) : null;
	if (user !== null) {
		router.navigate(["/dashboard"]);
		return false;
	} else return true;
};
