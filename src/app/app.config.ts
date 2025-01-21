import {
	ApplicationConfig,
	ErrorHandler,
	provideZoneChangeDetection,
} from "@angular/core";
import {
	provideRouter,
	withComponentInputBinding,
	withEnabledBlockingInitialNavigation,
	withInMemoryScrolling,
} from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import { providePrimeNG } from "primeng/config";
import { ThemePreset } from "./theme";
import { appInterceptor } from "../services/app.interceptor";
import { GlobalErrorHandler } from "../services/globalErrorHandler";

import { routes } from "./app.routes";
import { MessageService } from "primeng/api";

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({
				anchorScrolling: "enabled",
				scrollPositionRestoration: "enabled",
			}),
			withEnabledBlockingInitialNavigation(),
			withComponentInputBinding()
		),
		provideAnimationsAsync(),
		provideHttpClient(withFetch(), withInterceptors([appInterceptor])),
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
		providePrimeNG({
			theme: {
				preset: ThemePreset,
				options: { darkModeSelector: false || "none" },
			},
			ripple: false,
			inputStyle: "outlined",
		}),
		MessageService,
	],
};
