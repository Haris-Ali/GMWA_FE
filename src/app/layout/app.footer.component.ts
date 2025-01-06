import { Component } from "@angular/core";
import { LayoutService } from "./service/app.layout.service";

@Component({
	selector: "app-footer",
	standalone: true,
	imports: [],
	providers: [LayoutService],
	templateUrl: "./app.footer.component.html",
})
export class AppFooterComponent {
	constructor(public layoutService: LayoutService) {}
}
