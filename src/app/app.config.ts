import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
	provideRouter,
	withEnabledBlockingInitialNavigation,
	withInMemoryScrolling,
} from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeng/themes/aura";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({
				anchorScrolling: "enabled",
				scrollPositionRestoration: "enabled",
			}),
			withEnabledBlockingInitialNavigation()
		),
		provideAnimationsAsync(),
		provideHttpClient(withFetch()),
		providePrimeNG({
			theme: {
				preset: Aura,
				options: { darkModeSelector: false || "none" },
			},
		}),
	],
};
