export const DASHBOARD_CONFIG = {
	super_admin: [
		{
			title: "Pending Registrations",
			key: "pendingRegistrations",
			icon: "pi pi-fw pi-user-plus",
			dataKey: "pendingRegistrationsCount",
		},
		{
			title: "Total Registrations",
			key: "totalRegistrations",
			icon: "pi pi-fw pi-users",
			dataKey: "totalRegistrations",
		},
		{
			title: "Quick Links",
			key: "quickLinks",
			icon: "link",
			dataKey: "quickLinks",
		},
	],
	teacher: [
		{
			title: "Assignments",
			key: "assignments",
			icon: "pi pi-fw pi-file",
			dataKey: "assignmentCount",
		},
		{
			title: "Classrooms",
			key: "classrooms",
			icon: "pi pi-fw pi-folder",
			dataKey: "classroomCount",
		},
		{
			title: "Quick Links",
			key: "quickLinks",
			icon: "link",
			dataKey: "quickLinks",
		},
	],
	student: [
		{
			title: "Assignments",
			key: "assignments",
			icon: "pi pi-fw pi-file",
			dataKey: "assignmentCount",
		},
		{
			title: "Classrooms",
			key: "classrooms",
			icon: "pi pi-fw pi-folder",
			dataKey: "classroomCount",
		},
	],
};
