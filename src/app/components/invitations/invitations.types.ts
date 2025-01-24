type Invitation = {
	id: number;
	email: string;
	created_at: Date;
	invitation_accepted_at?: Date;
	status: string;
};

export { Invitation };
