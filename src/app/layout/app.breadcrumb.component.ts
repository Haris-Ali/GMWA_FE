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
			class="breadcrumb-container"
			*ngIf="breadcrumbs.length > 0"
		>
			<ol class="breadcrumb">
				<li
					*ngFor="let breadcrumb of breadcrumbs; let last = last"
					class="breadcrumb-item"
					[ngClass]="{ active: last }"
				>
					<ng-container *ngIf="!last">
						<a [routerLink]="breadcrumb.url">
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
			padding: 1rem;
			border-radius: var(--content-border-radius);
			margin-bottom: .5rem;
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
					const breadcrumbURL = url
						.split("/")
						.slice(0, index + 1)
						.join("/");
					if (!breadcrumbs.find((bc) => bc.url === breadcrumbURL)) {
						breadcrumbs.push({ label, url: breadcrumbURL });
					}
				});
			}
			return this.createBreadcrumbs(child, url, breadcrumbs);
		}
		return breadcrumbs;
	}
}
