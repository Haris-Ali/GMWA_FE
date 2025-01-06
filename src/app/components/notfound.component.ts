import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
	selector: "app-notfound",
	standalone: true,
	imports: [RouterModule],
	template: `
		<div
			class="surface-ground flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
		>
			<div class="flex flex-col items-center justify-center">
				<img
					src="assets/icon.png"
					alt="logo"
					class="mb-5 w-[6rem] flex-shrink-0"
				/>
				<div class="rounded-2xl p-1 bg-white">
					<div
						class="w-full surface-card py-8 px-5 sm:px-8 flex flex-col items-center"
						style="border-radius:53px"
					>
						<span class="text-blue-500 font-bold text-3xl">
							404
						</span>
						<h1
							class="text-900 font-bold text-3xl lg:text-5xl mb-2"
						>
							Not Found
						</h1>
						<div class="text-600 mb-5">
							Requested resource is not available.
						</div>
						<a
							[routerLink]="['/']"
							class="w-full flex items-center justify-center py-5 border-300 border-bottom-1"
						>
							<span class="ml-4 flex flex-col">
								<span
									class="text-900 lg:text-xl font-medium mb-0 block"
								>
									Back To Dashboard
								</span>
							</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class NotfoundComponent {}
