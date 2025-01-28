import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "objectPropertyTable",
	standalone: true,
	pure: true,
})
export class ObjectPropertyTablePipe implements PipeTransform {
	transform(value: any, field: string): any {
		return field
			.split(".")
			.reduce((obj, key) => (obj ? obj[key] : undefined), value);
	}
}
