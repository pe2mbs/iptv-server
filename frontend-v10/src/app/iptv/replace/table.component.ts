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
#   gencrud: 2022-04-10 21:02:18 version 3.0.685 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { TableDefintion } from 'src/app/gencrud/crud/model';
import { ReplaceRecord } from './model';
import { ReplaceDataService } from './service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-replace-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ReplaceTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<ReplaceRecord> = {
        toggleUpdate: false,
        name: 'ReplaceTable',
		helpTopic: 'replace-table',
		defaultSortField: 'IR_ID',
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
		footerButtons: [
		],
        rowDoubleClick: (core: any, self: any, idx: number, row: ReplaceRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'IR_FIND',
				header: "Find",
				display: true,
				width: "50%",
				filter: false,
				sort: false,
                cell: (row: ReplaceRecord) => row.IR_FIND
            },
            {
                columnDef: 'IR_REPLACE',
				header: "Replace",
				display: true,
				width: "50%",
				filter: false,
				sort: false,
                cell: (row: ReplaceRecord) => row.IR_REPLACE
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: ReplaceRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: ReplaceRecord) => {
							core.deleteRecord( idx, row, 'IS_ID', 'Replacement', 'IS_NAME'  );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: ReplaceDataService
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
        this.router.navigate( ['/replace/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: ReplaceRecord ): void
	{
        this.router.navigate( ['/replace/edit'], {
			queryParams: { 	id: 'IR_ID', mode: 'edit', value: row.IR_ID }
		} );
        return;
	}
}

