type Milestone = {
	id: number;
	name: string;
	weightage: string;
	dead_line: string;
	assignment_id: number;
	assignment_evaluation_method: string;
	created_at: string;
	updated_at: string;
	can_perform_evaluation: boolean;
	can_manage_criteria: boolean;
};

export { Milestone };
