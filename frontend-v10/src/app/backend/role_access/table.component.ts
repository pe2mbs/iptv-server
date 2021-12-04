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
#   gencrud: 2021-04-04 08:27:09 version 2.1.680 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { RoleAccessRecord } from './model';
import { RoleAccessDataService } from './service';
import { RoleDataService } from '../role/service';
import { ModuleAccessDataService } from '../mod_access/service';
import { TableDefintion } from 'src/app/gencrud/crud/model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-role_access-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class RoleAccessTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<RoleAccessRecord> = {
        toggleUpdate: false,
        name: 'RoleAccessTable',
		helpTopic: 'role_access-table',
		defaultSortField: 'RA_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: RoleAccessRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'RA_R_ID',
				header: "Role",
				display: true,
				width: "50%",
				filter: false,
				sort: false,
                cell: (row: RoleAccessRecord) => {
                    return ( row.RA_R_ID_FK.R_ROLE );
                }
            },
            {
                columnDef: 'RA_MA_ID',
				header: "Module",
				display: true,
				width: "50%",
				filter: false,
				sort: false,
                cell: (row: RoleAccessRecord) => {
                    return ( row.RA_MA_ID_FK.MA_DESCRIPTION );
                }
            },
            {
                columnDef: 'RA_CREATE',
				header: "Create",
				display: true,
				width: "80px",
				filter: false,
				sort: false,
				cell: (row: RoleAccessRecord) => row.RA_CREATE_LABEL
            },
            {
                columnDef: 'RA_READ',
				header: "Read",
				display: true,
				width: "80px",
				filter: false,
				sort: false,
				cell: (row: RoleAccessRecord) => row.RA_READ_LABEL
            },
            {
                columnDef: 'RA_UPDATE',
				header: "Update",
				display: true,
				width: "80px",
				filter: false,
				sort: false,
				cell: (row: RoleAccessRecord) => row.RA_UPDATE_LABEL
            },
            {
                columnDef: 'RA_DELETE',
				header: "Delete",
				display: true,
				width: "80px",
				filter: false,
				sort: false,
				cell: (row: RoleAccessRecord) => row.RA_DELETE_LABEL
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: RoleAccessRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: RoleAccessRecord) => {
							core.deleteRecord( idx, row, 'RA_ID', 'Module', 'RA_MODULE'  );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: RoleAccessDataService
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
        this.router.navigate( ['/role_access/edit'], {
			queryParams: { mode: 'new' }
		} );
		return;
	}

    public editRecord( idx: number, row: RoleAccessRecord ): void
	{
        this.router.navigate( ['/role_access/edit'], {
			queryParams: { 	id: 'RA_ID', mode: 'edit', value: row.RA_ID }
		} );
        return;
	}
}

