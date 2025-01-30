import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "snakeToSpace",
	standalone: true,
	pure: true,
})
export class SnakeToSpacePipe implements PipeTransform {
	transform(value: string): string {
		return value.replace(/_/g, " ");
	}
}
