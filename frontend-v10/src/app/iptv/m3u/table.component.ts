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
#   gencrud: 2021-10-24 19:20:52 version 3.0.685 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { TableDefintion } from 'src/app/gencrud/crud/model';
import { M3uRecord } from './model';
import { M3uDataService } from './service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-m3u-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class M3uTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<M3uRecord> = {
        toggleUpdate: false,
        name: 'M3uTable',
		helpTopic: 'm3u-table',
		defaultSortField: 'M_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: M3uRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'M_TITLE',
				header: "Title",
				display: true,
				width: "100%",
				filter: true,
				sort: true,
                cell: (row: M3uRecord) => row.M_TITLE
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: M3uRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: M3uRecord) => {
							core.deleteRecord( idx, row, 'M_ID', 'Media', 'M_TITLE'  );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: M3uDataService
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
        this.router.navigate( ['/m3u/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: M3uRecord ): void
	{
        this.router.navigate( ['/m3u/edit'], {
			queryParams: { 	id: 'M_ID', mode: 'edit', value: row.M_ID }
		} );
        return;
	}
}

