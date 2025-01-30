import { OnInit, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

@Component({
	selector: "app-breadcrumb",
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<nav
			aria-label="breadcrumb"
			class="bg-surface-overlay p-2 rounded-[var(--content-border-radius)] mb-4 overflow-x-auto"
			*ngIf="breadcrumbs.length > 0"
		>
			<ol class="flex flex-nowrap items-center list-none p-0 min-w-max">
				<li
					*ngFor="let breadcrumb of breadcrumbs; let last = last"
					class="mr-2 text-sm md:text-base whitespace-nowrap"
					[ngClass]="{ 'font-bold': last }"
				>
					<ng-container *ngIf="!last">
						<a
							[routerLink]="breadcrumb.url"
							class="hover:text-primary"
						>
							<ng-container
								*ngIf="breadcrumb.label === 'dashboard'"
							>
								<i class="pi pi-home"></i>
							</ng-container>
							<ng-container
								*ngIf="breadcrumb.label !== 'dashboard'"
							>
								{{ breadcrumb.label | titlecase }}
							</ng-container>
							/
						</a>
					</ng-container>
					<ng-container *ngIf="last">
						{{ breadcrumb.label | titlecase }}
					</ng-container>
				</li>
			</ol>
		</nav>
	`,
	styles: `
		.breadcrumb-container {
			background: var(--surface-overlay);
			padding: .5rem;
			border-radius: var(--content-border-radius);
			margin-bottom: 1rem;
		}

		.breadcrumb {
			display: flex;
			list-style: none;
			padding: 0;
		}

		.breadcrumb-item {
			margin-right: 0.5rem;
		}

		.breadcrumb-item.active {
			font-weight: bold;
		}
	`,
})
export class AppBreadCrumbComponent implements OnInit {
	activatedRoute = inject(ActivatedRoute);
	router = inject(Router);

	breadcrumbs: Array<{ label: string; url: string }> = [];

	ngOnInit(): void {
		this.router.events.subscribe(() => {
			this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
		});
	}

	private createBreadcrumbs(
		route: ActivatedRoute,
		url: string = "",
		breadcrumbs: Array<{ label: string; url: string }> = []
	): Array<{ label: string; url: string }> {
		const children: ActivatedRoute[] = route.children;
		if (children.length === 0) return breadcrumbs;

		for (const child of children) {
			const routeURL: string = child.snapshot.url
				.map((segment) => segment.path)
				.join("/");
			if (routeURL !== "") url += `/${routeURL}`;

			const labels: string[] | undefined =
				child.snapshot.data["breadcrumbs"];
			if (labels) {
				labels.forEach((label, index) => {
					let breadcrumbURL = url
						.split("/")
						.slice(0, index + 1)
						.join("/");

					let displayLabel = label;
					if (typeof label === "object") {
						const labelText = (label as { text: string }).text;
						if (labelText.startsWith(":")) {
							const paramName = labelText.substring(1);
							displayLabel = child.snapshot.params[paramName] || label;
						}
					}
					if (displayLabel.includes("_")) displayLabel = displayLabel.replace("_", " ");
					if (!breadcrumbs.find((bc) => bc.url === breadcrumbURL)) {
						breadcrumbs.push({
							label: displayLabel,
							url: breadcrumbURL,
						});
					}
				});
			}
			return this.createBreadcrumbs(child, url, breadcrumbs);
		}
		return breadcrumbs;
	}
}
