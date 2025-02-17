export const DASHBOARD_CONFIG = {
	super_admin: [
		{
			title: "Pending Registrations",
			key: "pendingRegistrations",
			icon: "pi pi-fw pi-user-plus",
			dataKey: "pending_registrations_count",
		},
		{
			title: "Total Registrations",
			key: "totalRegistrations",
			icon: "pi pi-fw pi-users",
			dataKey: "total_registrations_count",
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
			dataKey: "assignments_count",
		},
		{
			title: "Classrooms",
			key: "classrooms",
			icon: "pi pi-fw pi-folder",
			dataKey: "classrooms_count",
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
			dataKey: "published_assignments_count",
		},
		{
			title: "Classrooms",
			key: "classrooms",
			icon: "pi pi-fw pi-folder",
			dataKey: "enrolled_classrooms_count",
		},
	],
};
