import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WebAvaliaChartsComponent } from "./webavalia-charts.component";

describe("WebAvaliaChartsComponent", () => {
	let component: WebAvaliaChartsComponent;
	let fixture: ComponentFixture<WebAvaliaChartsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WebAvaliaChartsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WebAvaliaChartsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
