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
import { NewsRecord } from './model';
import { NewsDataService } from './service';
import { TableDefintion } from 'src/app/gencrud/crud/model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-news-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class NewsTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<NewsRecord> = {
        toggleUpdate: false,
        name: 'NewsTable',
		helpTopic: 'news-table',
		defaultSortField: 'N_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: NewsRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'N_ACTIVE',
				header: "Active",
				display: true,
				width: "7%",
				filter: false,
				sort: false,
				cell: (row: NewsRecord) => row.N_ACTIVE_LABEL
            },
            {
                columnDef: 'N_MESSAGE',
				header: "Description",
				display: true,
				width: "50%",
				filter: false,
				sort: false,
                cell: (row: NewsRecord) => row.N_MESSAGE
            },
            {
                columnDef: 'N_ALERT',
				header: "Alert",
				display: true,
				width: "10%",
				filter: false,
				sort: false,
				cell: (row: NewsRecord) => row.N_ALERT_LABEL
            },
            {
                columnDef: 'N_KEEP',
				header: "No Delete",
				display: true,
				width: "10%",
				filter: false,
				sort: false,
				cell: (row: NewsRecord) => row.N_KEEP_LABEL
            },
            {
                columnDef: 'N_START_DATE',
				header: "Start date",
				display: true,
				width: "10%",
				filter: false,
				sort: false,
                cell: (row: NewsRecord) => row.N_START_DATE
            },
            {
                columnDef: 'N_END_DATE',
				header: "End date",
				display: true,
				width: "10%",
				filter: false,
				sort: false,
                cell: (row: NewsRecord) => row.N_END_DATE
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: NewsRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: NewsRecord) => {
							core.deleteRecord( idx, row, 'N_ID', 'News message', 'N_MESSAGE'  );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: NewsDataService
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
        this.router.navigate( ['/news/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: NewsRecord ): void
	{
        this.router.navigate( ['/news/edit'], {
			queryParams: { 	id: 'N_ID', mode: 'edit', value: row.N_ID }
		} );
        return;
	}
}

