import { HttpInterceptorFn } from "@angular/common/http";

export const appInterceptor: HttpInterceptorFn = (req, next) => {
	const storedData = localStorage.getItem("jwtToken");
	const jwtToken = storedData ? JSON.parse(storedData) : null;
	if (jwtToken) {
		req = req.clone({
			setHeaders: {
				Authorization: "Bearer " + jwtToken,
			},
		});
	}
	return next(req);
};
