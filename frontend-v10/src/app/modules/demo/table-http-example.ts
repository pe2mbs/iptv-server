import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExampleHttpDatabase } from './table-http-service';
import { TrackingRecord } from './model';
import { MatDialog } from '@angular/material/dialog';
import { GcCrudServiceBase } from 'src/app/gencrud/crud/crud.service.base';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { TableDefintion } from 'src/app/gencrud/crud/model';





/**
 * @title Table retrieving data through HTTP
 */
@Component({
	// tslint:disable-next-line:component-selector
	selector: 'table-http-example',
	styleUrls: [ 'table-http-example.css', 
				 '../../gencrud/common-mat-card.scss' ],
	template: `<app-cust-data-table
				class="card-content"
				[definition]="definition">
	</app-cust-data-table>`
})
// tslint:disable-next-line:component-class-suffix
export class TableHttpExample
{
	public definition: TableDefintion<TrackingRecord> = {
		name: 'DemoTable',
		helpTopic: 'demo-table',
		defaultSortField: 'T_USER',
		defaultSortDirection: 'desc',
		sortDisableClear: true,
		headerButtons: [
			{
				label: 'New',
				icon: 'add',
				action: (core: any, self: any) => {
					self.addRecord();
				}
			},
		],
		rowDoubleClick: (core: any, self: any, idx: number, row: TrackingRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
			{ 	columnDef: 'T_USER',
				display: true,
				header: 'User',
				width: "33%",
				filter: true,
				sort: true,
				cell: (row: TrackingRecord) => `${row.T_USER}` }, 
			{ 	columnDef: 'T_TABLE',
				display: true,
				header: 'Table',
				width: "33%",
				filter: true,
				sort: true,
				cell: (row: TrackingRecord) => `${row.T_TABLE}` }, 
			{ 	columnDef: 'T_ACTION_LABEL',
				display: true,
				header: 'Action',
				width: "33%",
				filter: false,
				sort: false,
				cell: (row: TrackingRecord) => `${row.T_ACTION_LABEL}` }, 
			{ 	columnDef: 'T_CHANGE_DATE_TIME',
				display: true,
				header: 'Change date time',
				width: "270px",
				filter: true,
				sort: true,
				cell: (row: TrackingRecord) => `${row.T_CHANGE_DATE_TIME}` },
			{
				columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: TrackingRecord) => {},
				buttons: [
					{
						label: 'Restore',
						icon: 'settings_backup_restore',
						action: (core: any, self: any, idx: number, row: TrackingRecord) => {
							self.restoreRecord( idx, row );
						}
					},
					{
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: TrackingRecord) => {
							core.deleteRecord( idx, row, 
												'T_ID',
												'Change date time', 
												'T_CHANGE_DATE_TIME' );
						}
					},
				]
			}
		]
	};
	constructor( dataService: ExampleHttpDatabase,
				 profileService: GcProfileService,
				 public router: Router, 
				 dialog: MatDialog )
	{
		this.definition.dataService = dataService;
		this.definition.profileService = profileService;
		this.definition.dialog = dialog;
		this.definition.self = this;
		return; 
	}

	public editRecord( idx: number, row: TrackingRecord ): void
	{
		console.log( 'editRecord( idx = ', idx, ", row = ", row, " )" );
		// this.router.navigate( ['/tracking/edit'], { 
		// 	queryParams: { 	id: 'T_ID', mode: 'edit', value: row.T_ID } 
		// } );
		return;
	}

	public addRecord(): void
	{
		console.log( 'addRecord()' );
		return;
	}

	public restoreRecord( idx: number, row: TrackingRecord ): void
	{
		console.log( 'restoreRecord( idx = ', idx, ", row = ", row, " )" );
		return;
	}
}
