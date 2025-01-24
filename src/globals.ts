import { environment } from './environments/environment';

const baseUrl = environment.baseUrl;

export const globals = {
	appName: "GMWA",

	urls: {
		auth: {
			login: baseUrl + "/users/sign_in",
			logout: baseUrl + "/users/sign_out",
			signup: baseUrl + "/users",
			forgotPassword: baseUrl + "/users/password",
			editPassword: baseUrl + "/users/password/edit",
			updatePassword: baseUrl + "/users/password",
			confirmationInstructions: baseUrl + "/users/confirmation",
			confirmation: baseUrl + "/users/confirmation",
			unlockInstructions: baseUrl + "/users/unlock",
			unlock: baseUrl + "/users/unlock",
			currentUser: baseUrl + "/users/sign_in",
		},

		dashboard: {
			data: baseUrl + "/stats",
		},

		registrations: {
			toggleAccountStatus:
				baseUrl + "/registrations/:id/toggle_account_status",
			index: baseUrl + "/registrations",
		},

		invitations: {
			accept: baseUrl + "/users/invitation/accept",
			remove: baseUrl + "/users/invitation/remove",
			new: baseUrl + "/users/invitation/new",
			resend: baseUrl + "/invitations/:id/resend",
			index: baseUrl + "/invitations",
		},

		classrooms: {
			list: baseUrl + "/classrooms",
			create: baseUrl + "/classrooms",
			new: baseUrl + "/classrooms/new",
			edit: baseUrl + "/classrooms/:id/edit",
			show: baseUrl + "/classrooms/:id",
			update: baseUrl + "/classrooms/:id",
			delete: baseUrl + "/classrooms/:id",
			enrollments: {
				getCsvTemplate:
					baseUrl +
					"/classrooms/:classroom_id/enrollments/get_csv_template",
				importCsv:
					baseUrl +
					"/classrooms/:classroom_id/enrollments/import_csv",
				processCsv:
					baseUrl +
					"/classrooms/:classroom_id/enrollments/process_csv",
				selfEnroll:
					baseUrl +
					"/classrooms/:classroom_id/enrollments/self_enroll",
				submitSelfEnroll:
					baseUrl +
					"/classrooms/:classroom_id/enrollments/submit_self_enroll",
				list: baseUrl + "/classrooms/:classroom_id/enrollments",
				create: baseUrl + "/classrooms/:classroom_id/enrollments",
				new: baseUrl + "/classrooms/:classroom_id/enrollments/new",
				edit: baseUrl + "/enrollments/:id/edit",
				show: baseUrl + "/enrollments/:id",
				update: baseUrl + "/enrollments/:id",
				delete: baseUrl + "/enrollments/:id",
			},
		},

		assignments: {
			classroomAssignments:
				baseUrl + "/classrooms/:classroom_id/assignments",
			newClassroomAssignment:
				baseUrl + "/classrooms/:classroom_id/assignments/new",
			edit: baseUrl + "/assignments/:id/edit",
			show: baseUrl + "/assignments/:id",
			update: baseUrl + "/assignments/:id",
			delete: baseUrl + "/assignments/:id",
			manageEvaluationMethod:
				baseUrl + "/assignments/:id/manage_evaluation_method_setting",
			showResults: baseUrl + "/assignments/:id/show_results",
			exportResults: baseUrl + "/assignments/:id/export_results_csv",
			calculateMarks:
				baseUrl + "/assignments/:id/calculate_student_marks",
			toggleStatus: baseUrl + "/assignments/:id/toggle_status",
		},
	},
};
