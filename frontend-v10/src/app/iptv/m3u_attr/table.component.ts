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
#   gencrud: 2021-10-24 19:21:03 version 3.0.685 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { TableDefintion } from 'src/app/gencrud/crud/model';
import { M3uAttrRecord } from './model';
import { M3uAttrDataService } from './service';
import { M3uDataService } from '../m3u/service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-m3u_attr-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class M3uAttrTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<M3uAttrRecord> = {
        toggleUpdate: false,
        name: 'M3uAttrTable',
		helpTopic: 'm3u_attr-table',
		defaultSortField: 'MA_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: M3uAttrRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'MA_ATTRIBUTE',
				header: "Title",
				display: true,
				width: "50%",
				filter: true,
				sort: true,
                cell: (row: M3uAttrRecord) => row.MA_ATTRIBUTE
            },
            {
                columnDef: 'MA_VALUE',
				header: "Link address",
				display: true,
				width: "50%",
				filter: true,
				sort: true,
                cell: (row: M3uAttrRecord) => row.MA_VALUE
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: M3uAttrRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: M3uAttrRecord) => {
							core.deleteRecord( idx, row, 'MA_ID', 'Attribute', 'MA_ATTRIBUTE' );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: M3uAttrDataService
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
        this.router.navigate( ['/m3u_attr/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: M3uAttrRecord ): void
	{
        this.router.navigate( ['/m3u_attr/edit'], {
			queryParams: { 	id: 'MA_ID', mode: 'edit', value: row.MA_ID }
		} );
        return;
	}
}

