type Enrollment = {
	id: number;
	user_id: number;
	classroom_id: number;
	roll_number: string;
	student_email: string;
	student_name: string;
	created_at: string;
	updated_at: string;
};

type CSVStudent = {
	roll_number: string;
	student_email: string;
};

export { Enrollment, CSVStudent };
