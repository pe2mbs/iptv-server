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
import { TrackingRecord } from './model';
import { TrackingBaseComponent } from './table.mixin';
import { TrackingDataService } from './service';
import { TableDefintion } from 'src/app/gencrud/crud/model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-tracking-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class TrackingTableComponent extends TrackingBaseComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<TrackingRecord> = {
        toggleUpdate: false,
        name: 'TrackingTable',
		helpTopic: 'tracking-table',
		defaultSortField: 'T_ID',
		defaultSortDirection: 'desc',
		sortDisableClear: true,
        headerButtons: [
		],
		footerButtons: [
		],
        rowDoubleClick: (core: any, self: any, idx: number, row: TrackingRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'T_USER',
				header: "User",
				display: true,
				width: "30%",
				filter: false,
				sort: false,
                cell: (row: TrackingRecord) => row.T_USER
            },
            {
                columnDef: 'T_TABLE',
				header: "Table",
				display: true,
				width: "30%",
				filter: false,
				sort: false,
                cell: (row: TrackingRecord) => row.T_TABLE
            },
            {
                columnDef: 'T_ACTION',
				header: "Action",
				display: true,
				width: "10%",
				filter: false,
				sort: false,
				cell: (row: TrackingRecord) => row.T_ACTION_LABEL
            },
            {
                columnDef: 'T_CHANGE_DATE_TIME',
				header: "Change timestamp",
				display: true,
				width: "300px",
				filter: false,
				sort: false,
                cell: (row: TrackingRecord) => row.T_CHANGE_DATE_TIME
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: TrackingRecord) => {},
                buttons: [
                    {
						label: 'Restore',
						icon: 'restore',
						action: (core: any, self: any, idx: number, row: TrackingRecord) => {
							self.restoreRecord( idx, row );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: TrackingDataService
               , profileService: GcProfileService
               , dialog: MatDialog
               , router: Router
 )
    {
        super( dataService, profileService, dialog, router );
        this.definition.dataService = dataService;
		this.definition.profileService = profileService;
		this.definition.dialog = dialog;
		this.definition.self = this;
        return;
    }

    public addRecord(): void
	{
	    console.log( 'addRecord()' );
        this.router.navigate( ['/tracking/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: TrackingRecord ): void
	{
        this.router.navigate( ['/tracking/edit'], {
			queryParams: { 	id: 'T_ID', mode: 'edit', value: row.T_ID }
		} );
        return;
	}
}

