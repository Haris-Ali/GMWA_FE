import { Component, OnInit, effect, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpService } from "../../../../services/http.service";
import { TableComponent } from "../../table.component";
import { SearchComponent } from "../../search.component";
import { HttpParams } from "@angular/common/http";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { Button } from "primeng/button";
import { Router, RouterModule } from "@angular/router";
import { globals } from "../../../../globals";
import { CSVStudent, Enrollment } from "../enrollments.type";
import { FileUploadModule } from "primeng/fileupload";
import { CopyClipboardDirective } from "../../../../directives/copy-clipboard.directive";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
	selector: "app-list",
	standalone: true,
	imports: [
		CommonModule,
		TableComponent,
		SearchComponent,
		ConfirmDialogModule,
		Button,
		RouterModule,
		FileUploadModule,
		CopyClipboardDirective,
		Toast,
	],
	providers: [ConfirmationService, HttpService, MessageService],
	template: `
		<div class="heading mb-4">
			<h6 class="font-bold text-xl">Enrolled Students</h6>
		</div>
		<div class="bg-white rounded-border w-full">
			<div
				class="flex justify-between mb-4 md:flex-row md:gap-0 flex-col gap-2"
			>
				<app-search
					placeholder="Search by student email..."
					(search)="onSearch($event)"
				></app-search>
				<div class="flex gap-2">
					<p-button
						type="button"
						severity="contrast"
						label="Copy Self Enrollment Link"
						class="text-gray-400 rounded-md"
						[copy-clipboard]="selfEnrollmentLink"
						(copied)="copySelfEnrollmentLink($event)"
					></p-button>
					<p-fileUpload
						mode="basic"
						chooseLabel="Import CSV"
						accept=".csv"
						[maxFileSize]="1000000"
						chooseIcon="pi pi-upload"
						(onSelect)="onFileSelect($event)"
						[auto]="true"
					></p-fileUpload>
					<p-button
						type="button"
						label="Enroll Students"
						icon="pi pi-plus"
						(onClick)="addStudents()"
					></p-button>
				</div>
			</div>
			<app-table
				[cols]="tableColumns"
				[data]="tableData"
				[buttons]="buttons"
				[loading]="loading"
				[totalRecords]="totalRecords"
				[rows]="10"
				(pageChangeOutput)="onPageChange($event)"
			/>
		</div>
		<p-confirmDialog></p-confirmDialog>
		<p-toast />
	`,
})
export class EnrollmentsListComponent {
	private httpService = inject(HttpService);
	private router = inject(Router);
	private confirmationService = inject(ConfirmationService);
	private messageService = inject(MessageService);

	globals = globals;
	classroomId = input.required<number>();

	tableColumns = [
		{ header: "Roll Number", field: "roll_number" },
		{ header: "Student Email", field: "student_email" },
		{ header: "Student Name", field: "student_name" },
		{ header: "Enrolled At", field: "created_at", type: "date" },
		{ header: "Actions", field: "", type: "action" },
	];

	tableData: Enrollment[] = [];

	buttons = [
		{
			label: "Remove",
			severity: "danger",
			callback: (data: Enrollment) => this.removeStudent(data),
		},
	];

	page = 1;
	first = 0;
	totalRecords = 0;
	loading: boolean = false;

	selectedFile: File | null = null;
	csvStudents: CSVStudent[] = [];

	selfEnrollmentLink = "";

	constructor() {
		effect(() => {
			this.selfEnrollmentLink = `http://localhost:4200/classrooms/${this.classroomId()}/self-enroll`;
			this.getData();
		});
	}

	addStudents() {
		this.router.navigate([
			`/classrooms/${this.classroomId()}/enrolled-students/add`,
		]);
	}

	removeStudent(enrollment: Enrollment) {
		this.confirmationService.confirm({
			message: `Are you sure you want to remove ${
				enrollment.student_name || enrollment.student_email
			}?`,
			header: "Remove Student",
			icon: "pi pi-exclamation-triangle",
			rejectLabel: "No, do not remove",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Yes, remove student",
				severity: "danger",
			},
			accept: () => {
				let url = `${this.globals.urls.classrooms.enrollments.delete}/${enrollment.id}`;
				this.httpService.deleteRequest(url).subscribe({
					next: (response: any) => {
						this.httpService.showSuccess(
							response.message,
							"Enrolled Student Removed"
						);
						this.getData();
					},
					error: (error) => {
						this.httpService.showError(error.message, "Error");
					},
				});
			},
		});
	}

	onPageChange(event: any) {
		if (this.first !== event.first) {
			this.first = event.first;
			this.page = Math.floor(this.first / event.rows) + 1;
			this.getData();
		}
	}

	onSearch(event: string) {
		this.page = 1;
		this.getData(event);
	}

	getData(searchQuery?: string) {
		this.loading = true;
		let params = new HttpParams().set("page", this.page);
		if (searchQuery)
			params = params.set(
				"q[roll_number_or_student_email_cont]",
				searchQuery
			);

		let url = this.globals.urls.classrooms.enrollments.list;
		url = url.replace(":classroom_id", this.classroomId().toString());
		this.httpService.getRequest(url, params).subscribe({
			next: (response: any) => {
				this.tableData = response.enrollments;
				this.totalRecords = response.pagination.count;
				this.loading = false;
			},
			error: () => {
				this.loading = false;
			},
		});
	}

	onFileSelect(event: any) {
		const file = event.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				try {
					const text = e.target.result;
					this.csvStudents = this.parseCSV(text);
					this.selectedFile = null;
					this.importCSV();
				} catch (error: any) {
					this.selectedFile = null;
				}
			};
			reader.readAsText(file);
		}
	}

	private parseCSV(text: string): CSVStudent[] {
		const students: CSVStudent[] = [];
		const rows = text
			.split("\n")
			.map((row) => row.split(",").map((cell) => cell.trim()));

		if (rows.length === 0) throw new Error("CSV file is empty");

		// Find column indices
		const header = rows[0].map((col) => col.toLowerCase());
		const emailIndex = header.findIndex(
			(col) => col === "email" || col === "student_email"
		);
		const rollNumberIndex = header.findIndex(
			(col) =>
				col === "roll number" || col === "id" || col === "roll_number"
		);

		if (emailIndex === -1 || rollNumberIndex === -1)
			throw new Error(
				"Required headers not found. CSV must contain 'email' or 'student_email' and 'roll number' (or 'id') columns"
			);

		// Track roll numbers to check uniqueness
		const usedRollNumbers = new Set<string>();

		rows.slice(1).forEach((row, index) => {
			if (row[emailIndex] && row[rollNumberIndex]) {
				const email = row[emailIndex].trim();
				const rollNumber = row[rollNumberIndex].trim();

				if (!this.isValidEmail(email))
					this.httpService.showError(
						`Invalid email format at row ${index + 2}: ${email}`,
						"Invalid Email"
					);
				if (usedRollNumbers.has(rollNumber))
					this.httpService.showError(
						`Duplicate roll number found at row ${
							index + 2
						}: ${rollNumber}`,
						"Duplicate Roll Number"
					);

				usedRollNumbers.add(rollNumber);
				students.push({
					roll_number: rollNumber,
					student_email: email,
				});
			}
		});

		if (students.length === 0) {
			this.httpService.showError(
				"No valid entries found in the CSV file",
				"No Data"
			);
		}

		return students;
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		return emailRegex.test(email);
	}

	importCSV() {
		if (this.csvStudents.length === 0) {
			this.httpService.showError(
				"Please upload a valid CSV file first",
				"No Data"
			);
			return;
		}
		let url = this.globals.urls.classrooms.enrollments.processCsv;
		url = url.replace(":classroom_id", this.classroomId().toString());
		this.httpService.postRequest(url, this.csvStudents).subscribe({
			next: (response: any) => {
				this.httpService.showSuccess(response.message, "CSV Imported");
				this.getData();
			},
			error: (error) => {
				this.httpService.showError(error.message, "Error");
			},
		});
	}

	copySelfEnrollmentLink(payload: string) {
		this.messageService.add({
			severity: "info",
			detail: "Link copied to clipboard",
		});
	}
}
