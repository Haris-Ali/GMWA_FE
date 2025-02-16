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
	can_show_evaluation: boolean;
};

type EvaluationCriterion = {
	id: number;
	name: string;
	min_value: string;
	max_value: string;
	weightage: string;
	milestone_id: number;
	created_at: string;
	updated_at: string;
};

type Enrollment = {
	id: number;
	roll_number: string;
	student: {
		id: number;
		name: string;
	};
};

type Marking = {
	id: number;
	evaluation: Record<string, unknown>;
	marked_by_id: number;
	marked_for_id: number;
	milestone_id: number;
	created_at: string;
	updated_at: string;
};

type MarkingWithEnrollment = {
	marking: Marking;
	enrollment: Enrollment;
};

type EvaluationData = {
	markings: MarkingWithEnrollment[];
	evaluation_criteria: EvaluationCriterion[];
	feedback: string;
};

export { Milestone, EvaluationData, MarkingWithEnrollment };
