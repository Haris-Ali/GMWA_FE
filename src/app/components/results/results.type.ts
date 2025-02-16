type Result = {
	id: number;
	name: string;
	marks: string;
	assignment_id: number;
	created_at: Date;
	updated_at: Date;
	setting: any;
	result: any;
};

// {
//     "id": 1,
//     "name": "Group-1",
//     "marks": "90.0",
//     "assignment_id": 3,
//     "created_at": "2025-01-16T15:57:19.830Z",
//     "updated_at": "2025-01-16T16:00:09.995Z",
//     "setting": {},
//     "result": {
//         "final_scores": {
//             "grouping_1": "90.0",
//             "grouping_2": "0.0",
//             "grouping_3": "0.0"
//         },
//         "milestone_3": {
//             "weightage": "1.0",
//             "grouping_1": {
//                 "peer_assessment": 0,
//                 "self_assessment": "50.0",
//                 "total_score": "10.0",
//                 "weighted_total": "10.0"
//             },
//             "grouping_2": {
//                 "peer_assessment": 0,
//                 "self_assessment": 0,
//                 "total_score": 0,
//                 "weighted_total": "0.0"
//             },
//             "grouping_3": {
//                 "peer_assessment": 0,
//                 "self_assessment": 0,
//                 "total_score": 0,
//                 "weighted_total": "0.0"
//             }
//         }
//     }
// }
