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
#   gencrud: 2021-10-24 19:21:22 version 3.0.685 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { TableDefintion } from 'src/app/gencrud/crud/model';
import { ChannelRecord } from './model';
import { ChannelDataService } from './service';
import { M3uDataService } from '../m3u/service';
import { BougetDataService } from '../bougets/service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-channels-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ChannelTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<ChannelRecord> = {
        toggleUpdate: false,
        name: 'ChannelTable',
		helpTopic: 'channels-table',
		defaultSortField: 'CH_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: ChannelRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'CH_NUMBER',
				header: "Number",
				display: true,
				width: "10%",
				filter: false,
				sort: true,
                cell: (row: ChannelRecord) => row.CH_NUMBER
            },
            {
                columnDef: 'CH_TITLE',
				header: "Title",
				display: true,
				width: "90%",
				filter: true,
				sort: true,
                cell: (row: ChannelRecord) => row.CH_TITLE
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: ChannelRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: ChannelRecord) => {
							core.deleteRecord( idx, row, 'CH_ID', 'Channel', 'CH_TITLE'  );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: ChannelDataService
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
        this.router.navigate( ['/channels/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: ChannelRecord ): void
	{
        this.router.navigate( ['/channels/edit'], {
			queryParams: { 	id: 'CH_ID', mode: 'edit', value: row.CH_ID }
		} );
        return;
	}
}

