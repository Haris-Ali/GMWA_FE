import { HttpInterceptorFn } from "@angular/common/http";

export const appInterceptor: HttpInterceptorFn = (req, next) => {
	let jwtToken = JSON.parse(localStorage.getItem("jwtToken") || "{}");
	if (jwtToken) {
		req = req.clone({
			setHeaders: {
				Authorization: "Bearer " + jwtToken,
			},
		});
	}
	return next(req);
};
