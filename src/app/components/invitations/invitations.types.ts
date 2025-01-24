type Invitation = {
	id: number;
	email: string;
	invitation_created_at: Date;
	invitation_accepted_at?: Date;
	status: string;
};

export { Invitation };
