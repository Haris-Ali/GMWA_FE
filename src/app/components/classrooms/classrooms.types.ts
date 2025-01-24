type TableColumns = {
	header: string;
	field: string;
	type?: "action" | "date";
};

type TableData = {
	id: number;
	name: string;
	created_at: Date;
	updated_at: Date;
	user_id: number;
	enrolled_students: number;
	assignments: number;
};

type ClassroomDetails = {
	id: number;
	name: string;
	created_at: Date;
	teacher_name: string;
	enrolled_students: number;
	assignments: number;
};

export { TableColumns, TableData, ClassroomDetails };
