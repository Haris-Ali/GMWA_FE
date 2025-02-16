import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { ChartModule } from "primeng/chart";

@Component({
	selector: "app-performance-charts",
	standalone: true,
	imports: [ChartModule, CommonModule],
	templateUrl: "./performance-charts.component.html",
	styleUrl: "./performance-charts.component.scss",
})
export class PerformanceChartsComponent {
	data = input<any>();

	chartOptions = {
		plugins: {
			legend: {
				labels: {
					color: "#334155",
				},
			},
		},
		scales: {
			x: {
				ticks: {
					color: "#64748B",
				},
				grid: {
					color: "#E2E8F0",
				},
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: "#64748B",
				},
				grid: {
					color: "#E2E8F0",
				},
			},
		},
	};

	assessmentChartData: any;
	comparisonChartData: any;
	scoresChartData: any;

	ngOnInit() {
		this.initCharts();
	}

	private initCharts() {
		this.createAssessmentChart();
		this.createComparisonChart();
		this.createScoresChart();
	}

	createAssessmentChart() {
		const groupingsMap = new Map<number, number>();
		this.data().groupings.forEach((grouping: any) => {
			groupingsMap.set(grouping.id, grouping.enrollment_id);
		});

		const chartDataMap = new Map<
			number,
			{
				peerAssessment: number[];
				selfAssessment: number[];
				totalScore: number[];
			}
		>();

		this.data().milestones.forEach((milestoneKey: any) => {
			const milestoneData =
				this.data().result[`milestone_${milestoneKey.id}`];

			if (!milestoneData) return;

			Object.entries(milestoneData)
				.filter(([key]) => key.startsWith("grouping_"))
				.forEach(([key, value]: [string, any]) => {
					const groupingId = parseInt(key.split("_")[1]);
					const enrollmentId = groupingsMap.get(groupingId);

					if (enrollmentId) {
						if (!chartDataMap.has(enrollmentId)) {
							chartDataMap.set(enrollmentId, {
								peerAssessment: [],
								selfAssessment: [],
								totalScore: [],
							});
						}

						const existingData = chartDataMap.get(enrollmentId)!;
						existingData.peerAssessment.push(
							parseFloat(value.peer_assessment)
						);
						existingData.selfAssessment.push(
							parseFloat(value.self_assessment)
						);
						existingData.totalScore.push(
							parseFloat(value.total_score)
						);
					}
				});
		});

		const chartData = Array.from(chartDataMap.entries()).map(
			([enrollmentId, scores]) => ({
				student: `Student ${enrollmentId}`,
				peerAssessment:
					scores.peerAssessment.reduce((sum, val) => sum + val, 0) /
					scores.peerAssessment.length,
				selfAssessment:
					scores.selfAssessment.reduce((sum, val) => sum + val, 0) /
					scores.selfAssessment.length,
				totalScore:
					scores.totalScore.reduce((sum, val) => sum + val, 0) /
					scores.totalScore.length,
			})
		);

		this.assessmentChartData = {
			labels: chartData.map((item) => item.student),
			datasets: [
				{
					label: "Peer Assessment",
					data: chartData.map((item) => item.peerAssessment),
					borderColor: "rgb(54, 162, 235)",
					backgroundColor: "rgba(54, 162, 235, 0.5)",
				},
				{
					label: "Self Assessment",
					data: chartData.map((item) => item.selfAssessment),
					borderColor: "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)",
				},
				{
					label: "Total Score",
					data: chartData.map((item) => item.totalScore),
					borderColor: "rgb(255, 159, 64)",
					backgroundColor: "rgba(255, 159, 64, 0.5)",
				},
			],
		};
	}

	createComparisonChart() {
		const groupingsMap = new Map<number, number>();
		this.data().groupings.forEach((grouping: any) => {
			groupingsMap.set(grouping.id, grouping.enrollment_id);
		});

		const chartDataMap = new Map<
			number,
			{
				peerAssessment: number[];
				selfAssessment: number[];
			}
		>();

		this.data().milestones.forEach((milestoneKey: any) => {
			const milestoneData =
				this.data().result[`milestone_${milestoneKey.id}`];

			if (!milestoneData) return;

			Object.entries(milestoneData)
				.filter(([key]) => key.startsWith("grouping_"))
				.forEach(([key, value]: [string, any]) => {
					const groupingId = parseInt(key.split("_")[1]);
					const enrollmentId = groupingsMap.get(groupingId);

					if (enrollmentId) {
						if (!chartDataMap.has(enrollmentId)) {
							chartDataMap.set(enrollmentId, {
								peerAssessment: [],
								selfAssessment: [],
							});
						}

						const existingData = chartDataMap.get(enrollmentId)!;
						existingData.peerAssessment.push(
							parseFloat(value.peer_assessment)
						);
						existingData.selfAssessment.push(
							parseFloat(value.self_assessment)
						);
					}
				});
		});

		const chartData = Array.from(chartDataMap.entries()).map(
			([enrollmentId, scores]) => ({
				student: `Student ${enrollmentId}`,
				peerAssessment:
					scores.peerAssessment.reduce((sum, val) => sum + val, 0) /
					scores.peerAssessment.length,
				selfAssessment:
					scores.selfAssessment.reduce((sum, val) => sum + val, 0) /
					scores.selfAssessment.length,
			})
		);

		this.comparisonChartData = {
			labels: chartData.map((item) => item.student),
			datasets: [
				{
					label: "Peer Assessment",
					data: chartData.map((item) => item.peerAssessment),
					borderColor: "rgb(54, 162, 235)",
					backgroundColor: "rgba(54, 162, 235, 0.5)",
				},
				{
					label: "Self Assessment",
					data: chartData.map((item) => item.selfAssessment),
					borderColor: "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)",
				},
			],
		};
	}

	createScoresChart() {
		const groupingsMap = new Map<number, number>();
		this.data().groupings.forEach((grouping: any) => {
			groupingsMap.set(grouping.id, grouping.enrollment_id);
		});

		const scores = Object.entries(this.data().result.final_scores).map(
			([key, value]) => {
				const groupingId = parseInt(key.split("_")[1]);
				const enrollmentId =
					groupingsMap.get(groupingId) ?? `Unknown (${groupingId})`;

				return {
					student: `Student ${enrollmentId}`,
					score: parseFloat(value as string),
				};
			}
		);

		this.scoresChartData = {
			labels: scores.map((item) => item.student),
			datasets: [
				{
					label: `Final Score (Out of ${parseFloat(
						this.data().group.marks
					)})`,
					data: scores.map((item) => item.score),
					borderColor: "rgb(54, 162, 235)",
					backgroundColor: "rgba(54, 162, 235, 0.5)",
				},
			],
		};
	}
}
