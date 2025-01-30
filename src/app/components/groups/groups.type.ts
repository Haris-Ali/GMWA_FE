type fieldConfig = {
	type: "double" | "boolean" | "selection";
	min?: number;
	max?: number;
	editable: boolean;
	options?: string[];
};

type Group = {
	id: number;
	name: string;
	marks: string;
	assignment_id: number;
	created_at: string;
	updated_at: string;
	setting: {
		self_assessment: boolean;
		self_assessment_weightage: number;
		written_feedback: string;
	};
	result: {};
	enrolled_students: EnrolledStudent[];
};

type EnrolledStudent = {
	id: number;
	user_id: number;
	classroom_id: number;
	roll_number: string;
	created_at: Date;
	updated_at: Date;
	name: string;
};

export { fieldConfig, Group, EnrolledStudent };
