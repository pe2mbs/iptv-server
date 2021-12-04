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
#   gencrud: 2021-04-04 08:26:08 version 2.1.680 by user mbertens
*/
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { CustDataTableComponent } from 'src/app/gencrud/crud/cust.data.table.component';
import { isNullOrUndefined } from 'util';
import { LanguagesRecord } from './model';
import { DialogLanguagesComponent } from './dialog.component';
import { LanguagesDataService } from './service';
import { TableDefintion } from 'src/app/gencrud/crud/model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-languages-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class LanguagesTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<LanguagesRecord> = {
        toggleUpdate: false,
        name: 'LanguagesTable',
		helpTopic: 'languages-table',
		defaultSortField: 'LA_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: LanguagesRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'LA_LABEL',
				header: "Language",
				display: true,
				width: "20%",
				filter: true,
				sort: true,
                cell: (row: LanguagesRecord) => row.LA_LABEL
            },
            {
                columnDef: 'LA_CODE2',
				header: "Lang. code-2",
				display: true,
				width: "20%",
				filter: true,
				sort: true,
                cell: (row: LanguagesRecord) => row.LA_CODE2
            },
            {
                columnDef: 'LA_CODE3',
				header: "Lang. code-3",
				display: true,
				width: "20%",
				filter: true,
				sort: true,
                cell: (row: LanguagesRecord) => row.LA_CODE3
            },
            {
                columnDef: 'LA_COUNTRY_CODE2',
				header: "Country code-2",
				display: true,
				width: "20%",
				filter: true,
				sort: true,
                cell: (row: LanguagesRecord) => row.LA_COUNTRY_CODE2
            },
            {
                columnDef: 'LA_COUNTRY_CODE3',
				header: "Country code-3",
				display: true,
				width: "20%",
				filter: true,
				sort: true,
                cell: (row: LanguagesRecord) => row.LA_COUNTRY_CODE3
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: LanguagesRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: LanguagesRecord) => {
							core.deleteRecord( idx, row, 'LA_ID', 'Language', 'LA_LABEL' );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: LanguagesDataService
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
        const newRecord = new LanguagesRecord();
        const options: MatDialogConfig = {
            data: { record: newRecord,
                    fixed: null,
                    mode: 'add'
            },
            width: "60%",
        };
        if ( !isNullOrUndefined( this.id ) && !isNullOrUndefined( this.value ) )
		{
		    options.data.fixed = {}
			options.data.fixed[ this.id ] = this.value;
		}
        const dialogRef = this.dialog.open( DialogLanguagesComponent, options );
        dialogRef.afterClosed().subscribe( result =>
        {
            console.log( 'addNew() dialog result ', result );
            this.tableComponent.refresh();
        } );
		return;
	}

    public editRecord( idx: number, row: LanguagesRecord ): void
	{
        this.definition.dataService.lockRecord( row );
        const options: MatDialogConfig = {
            data: { record: row,
                    fixed: null,
                    mode: 'edit'
            },
            width: "60%",
        };
        if ( !isNullOrUndefined( this.id ) && !isNullOrUndefined( this.value ) )
		{
		    options.data.fixed = {}
			options.data.fixed[ this.id ] = this.value;
		}
        const dialogRef = this.dialog.open( DialogLanguagesComponent, options );
        dialogRef.afterClosed().subscribe( result =>
        {
            console.log( 'editRecord() dialog result ', result );
            this.definition.dataService.unlockRecord( row );
            this.tableComponent.refresh();
        } );
        return;
	}
}

