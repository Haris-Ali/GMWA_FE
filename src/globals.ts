import { environment } from './environments/environment';

const baseUrl = environment.baseUrl;

export const globals = {
	appName: "GMWA",

	urls: {
		auth: {
			login: baseUrl + "/users/sign_in",
			logout: baseUrl + "/users/sign_out",
			signup: baseUrl + "/users/sign_up",
			forgotPassword: baseUrl + "/users/forgotPassword",
			confirmationInstructions: baseUrl + "/users/confirmation/new",
			unlockInstructions: baseUrl + "/users/unlock/new",
			currentUser: baseUrl + "/users/sign_in",
		},

		// MORE API URLS HERE
		dashboard: {
			data: baseUrl + "/stats",
		},
	},
};
