type Assignment = {
	id: number;
	name: string;
	description: string;
	evaluation_method: string;
	evaluation_method_setting: {
		self_assessment: string;
		written_feedback: string;
	};
	status: string;
	total_marks: string;
	classroom_id: number;
	created_at: string;
	updated_at: string;
	can_calculate_student_marks: boolean;
	can_show_results: boolean;
};

export { Assignment };
