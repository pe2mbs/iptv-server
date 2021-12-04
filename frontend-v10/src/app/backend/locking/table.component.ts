/*
#
#   Python backend and Angular frontend code generation by gencrud
#   Copyright (C) 2018-2020 Marc Bertens-Nguyen m.bertens@pe2mbs.nl
#
#   This library is free software; you can redistribute it and/or modify
#   it under the terms of the GNU Library General Public License GPL-2.0-only
#   as published by the Free Software Foundation.
#
#   This library is distributed in the hope that it will be useful, but
#   WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
#   Library General Public License for more details.
#
#   You should have received a copy of the GNU Library General Public
#   License GPL-2.0-only along with this library; if not, write to the
#   Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
#   Boston, MA 02110-1301 USA
#
#   gencrud: 2021-04-04 08:26:09 version 2.1.680 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { RecordLocksRecord } from './model';
import { RecordLocksDataService } from './service';
import { TableDefintion } from 'src/app/gencrud/crud/model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-locking-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class RecordLocksTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<RecordLocksRecord> = {
        toggleUpdate: false,
        name: 'RecordLocksTable',
		helpTopic: 'locking-table',
		defaultSortField: 'L_ID',
		defaultSortDirection: 'desc',
		sortDisableClear: true,
        headerButtons: [
		],
		footerButtons: [
		],
        rowDoubleClick: (core: any, self: any, idx: number, row: RecordLocksRecord) => {
		},
		columns: [
            {
                columnDef: 'L_USER',
				header: "Username",
				display: true,
				width: "50%",
				filter: false,
				sort: false,
                cell: (row: RecordLocksRecord) => row.L_USER
            },
            {
                columnDef: 'L_TABLE',
				header: "Table",
				display: true,
				width: "50%",
				filter: false,
				sort: false,
                cell: (row: RecordLocksRecord) => row.L_TABLE
            },
            {
                columnDef: 'L_START_DATE',
				header: "Start lock",
				display: true,
				width: "300px",
				filter: false,
				sort: false,
                cell: (row: RecordLocksRecord) => row.L_START_DATE
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: RecordLocksRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: RecordLocksRecord) => {
							core.deleteRecord( idx, row, 'L_ID', 'User', 'L_USER'  );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: RecordLocksDataService
               , profileService: GcProfileService
               , protected dialog: MatDialog
               , public router: Router )
    {
        this.definition.dataService = dataService;
		this.definition.profileService = profileService;
		this.definition.dialog = dialog;
		this.definition.self = this;
        return;
    }

    public addRecord(): void
	{
	    console.log( 'addRecord()' );
        this.router.navigate( ['/locking/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: RecordLocksRecord ): void
	{
        this.router.navigate( ['/locking/edit'], {
			queryParams: { 	id: 'L_ID', mode: 'edit', value: row.L_ID }
		} );
        return;
	}
}

