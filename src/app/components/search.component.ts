import { Component, EventEmitter, input, Output } from "@angular/core";
import { Subject, debounceTime } from "rxjs";
import { InputTextModule } from "primeng/inputtext";

@Component({
	selector: "app-search",
	standalone: true,
	imports: [InputTextModule],
	template: `
		<input
			type="text"
			pInputText
			[placeholder]="placeholder()"
			(input)="onInput($event)"
			class="w-full md:w-72 lg:w-96 rounded-md border outline-none"
		/>
	`,
	styles: ``,
})
export class SearchComponent {
	placeholder = input.required<string>();
	@Output() search = new EventEmitter<string>();
	private searchSubject = new Subject<string>();

	ngOnInit() {
		this.searchSubject
			.pipe(debounceTime(400))
			.subscribe((query) => this.search.emit(query));
	}

	onInput(event: Event) {
		const query = event.target as HTMLInputElement;
		this.searchSubject.next(query.value);
	}
}
