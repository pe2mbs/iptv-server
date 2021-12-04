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
#   gencrud: 2021-04-04 08:26:10 version 2.1.680 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { UserRecord } from './model';
import { UserDataService } from './service';
import { RoleDataService } from '../role/service';
import { LanguagesDataService } from '../languages/service';
import { TableDefintion } from 'src/app/gencrud/crud/model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-user-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class UserTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<UserRecord> = {
        toggleUpdate: false,
        name: 'UserTable',
		helpTopic: 'user-table',
		defaultSortField: 'U_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: UserRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'U_NAME',
				header: "Username",
				display: true,
				width: "150px",
				filter: false,
				sort: false,
                cell: (row: UserRecord) => row.U_NAME
            },
            {
                columnDef: 'U_FIRST_NAME',
				header: "First name",
				display: true,
				width: "30%",
				filter: false,
				sort: false,
                cell: (row: UserRecord) => row.U_FIRST_NAME
            },
            {
                columnDef: 'U_LAST_NAME',
				header: "Last name",
				display: true,
				width: "30%",
				filter: false,
				sort: false,
                cell: (row: UserRecord) => row.U_LAST_NAME
            },
            {
                columnDef: 'U_EMAIL',
				header: "E-Mail address",
				display: true,
				width: "30%",
				filter: false,
				sort: false,
                cell: (row: UserRecord) => row.U_EMAIL
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: UserRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: UserRecord) => {
							core.deleteRecord( idx, row, 'U_ID', 'User', 'U_NAME'  );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: UserDataService
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
        this.router.navigate( ['/user/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: UserRecord ): void
	{
        this.router.navigate( ['/user/edit'], {
			queryParams: { 	id: 'U_ID', mode: 'edit', value: row.U_ID }
		} );
        return;
	}
}

