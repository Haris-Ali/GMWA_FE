import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { ObjectPropertyTablePipe } from "../../pipes/object-property-table.pipe";
import { Tooltip } from "primeng/tooltip";

@Component({
	selector: "app-table",
	standalone: true,
	imports: [
		CommonModule,
		TableModule,
		Button,
		Tag,
		Tooltip,
		ObjectPropertyTablePipe,
	],
	template: `
		<p-table
			[columns]="cols()"
			[value]="data()"
			[paginator]="true"
			[rows]="rows() || 10"
			[loading]="loading()"
			(onPage)="pageChange($event)"
			[totalRecords]="totalRecords()"
			[lazy]="true"
		>
			<ng-template pTemplate="header" let-columns>
				<tr>
					<th *ngFor="let col of columns">
						{{ col.header }}
					</th>
				</tr>
			</ng-template>
			<ng-template pTemplate="body" let-rowData>
				<tr>
					<td *ngFor="let col of cols()">
						<ng-container [ngSwitch]="col.type">
							<ng-container *ngSwitchCase="'action'">
								<div class="flex gap-2">
									<ng-container
										*ngFor="let button of buttons()"
									>
										<p-button
											type="button"
											[severity]="
												getButtonSeverity(
													button,
													rowData
												)
											"
											[label]="
												getButtonLabel(button, rowData)
											"
											(onClick)="button.callback(rowData)"
											*ngIf="
												button.condition
													? button.condition(rowData)
													: true
											"
											[pTooltip]="
												button.tooltip
													? button.tooltip
													: ''
											"
										/>
									</ng-container>
								</div>
							</ng-container>

							<ng-container *ngSwitchCase="'tag'">
								<p-tag [value]="rowData[col.field]"></p-tag>
							</ng-container>

							<ng-container *ngSwitchCase="'date'">
								{{ rowData[col.field] | date : "dd/MM/yyyy" }}
							</ng-container>

							<ng-container *ngSwitchCase="'link'">
								<p
									(click)="show(rowData)"
									class="cursor-pointer underline text-primary"
								>
									{{ rowData[col.field] }}
								</p>
							</ng-container>

							<ng-container *ngSwitchDefault>
								{{ rowData | objectPropertyTable : col.field }}
							</ng-container>
						</ng-container>
					</td>
				</tr>
			</ng-template>

			<ng-template pTemplate="emptymessage">
				<tr>
					<td colspan="100%" class="">
						<div class="text-center font-bold text-xl">
							No Records Found
						</div>
					</td>
				</tr>
			</ng-template>
		</p-table>
	`,
	styles: ``,
})
export class TableComponent {
	cols = input.required<any[]>();
	data = input.required<any[]>();
	buttons = input.required<any[]>();
	loading = input.required<boolean>();
	totalRecords = input.required<number>();
	rows = input<number>();

	pageChangeOutput = output<any>();
	redirectOutput = output<any>();

	getButtonLabel(button: any, rowData: any): string {
		return typeof button.label === "function"
			? button.label(rowData)
			: button.label;
	}

	getButtonSeverity(button: any, rowData: any): any {
		return typeof button.severity === "function"
			? button.severity(rowData)
			: button.severity;
	}

	pageChange(event: any) {
		this.pageChangeOutput.emit(event);
	}

	show(event: any) {
		this.redirectOutput.emit(event);
	}
}
