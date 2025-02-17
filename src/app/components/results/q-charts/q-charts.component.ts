import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { ChartModule } from "primeng/chart";

@Component({
	selector: "app-q-charts",
	standalone: true,
	imports: [ChartModule, CommonModule],
	templateUrl: "./q-charts.component.html",
	styleUrl: "./q-charts.component.scss",
})
export class QChartsComponent {
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

	contributionRatingChartData: any;

	ngOnInit() {
		this.initCharts();
	}

	initCharts() {
		const groupingsMap = new Map<number, number>();
		this.data().groupings.forEach((grouping: any) => {
			groupingsMap.set(grouping.id, grouping.enrollment_id);
		});

		const contributionRatingData = Array.from(groupingsMap.entries()).map(
			([groupingId, enrollmentId]) => {
				const studentLabel = `Student ${enrollmentId}`;
				const groupingData =
					this.data().result[`grouping_${groupingId}`];

				return {
					student: studentLabel,
					contribution: parseFloat(groupingData?.contribution ?? "0"),
					rating: parseFloat(groupingData?.rating ?? "0"),
				};
			}
		);

		this.contributionRatingChartData = {
			labels: contributionRatingData.map((item) => item.student),
			datasets: [
				{
					label: "Contribution",
					data: contributionRatingData.map(
						(item) => item.contribution
					),
					backgroundColor: "rgba(75, 192, 192, 0.5)",
					borderColor: "rgb(75, 192, 192)",
				},
				{
					label: "Rating",
					data: contributionRatingData.map((item) => item.rating),
					backgroundColor: "rgba(255, 159, 64, 0.5)",
					borderColor: "rgb(255, 159, 64)",
				},
			],
		};
	}
}
