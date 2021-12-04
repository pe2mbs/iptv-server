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
import { LanguageReferenceRecord } from './model';
import { DialogLanguageReferenceComponent } from './dialog.component';
import { LanguageReferenceDataService } from './service';
import { LanguagesDataService } from '../languages/service';
import { LanguageTranslationsDataService } from '../language_translates/service';
import { TableDefintion } from 'src/app/gencrud/crud/model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-language_reference-table',
    template: `<app-cust-data-table
				class="card-content"
				[id]="id"
				[value]="value"
				[mode]="mode"
				[definition]="definition">
</app-cust-data-table>`,
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class LanguageReferenceTableComponent
{
    @ViewChild( CustDataTableComponent, { static: true } )	tableComponent: CustDataTableComponent;
    @Input()	id: string;
	@Input()	value: any;
	@Input()	mode: string;

    public definition: TableDefintion<LanguageReferenceRecord> = {
        toggleUpdate: false,
        name: 'LanguageReferenceTable',
		helpTopic: 'language_reference-table',
		defaultSortField: 'LR_ID',
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
        rowDoubleClick: (core: any, self: any, idx: number, row: LanguageReferenceRecord) => {
			self.editRecord( idx, row );
		},
		columns: [
            {
                columnDef: 'LR_LA_ID',
				header: "Language",
				display: true,
				width: "20%",
				filter: false,
				sort: false,
                cell: (row: LanguageReferenceRecord) => {
                    return ( row.LR_LA_ID_FK.LA_LABEL );
                }
            },
            {
                columnDef: 'TR_TEXT',
				header: "Text",
				display: true,
				width: "80%",
				filter: false,
				sort: false,
                cell: (row: LanguageReferenceRecord) => row.TR_TEXT
            },
            {
                columnDef: null,
				display: true,
				header: 'Options',
				width: '70px',
				cell: (row: LanguageReferenceRecord) => {},
                buttons: [
                    {
						label: 'Delete',
						icon: 'delete',
						action: (core: any, self: any, idx: number, row: LanguageReferenceRecord) => {
							core.deleteRecord( idx, row, 'LR_ID', 'Language text', 'TR_TEXT' );
						}
					},
                ]
            }
        ]
    };

    constructor( dataService: LanguageReferenceDataService
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
        const newRecord = new LanguageReferenceRecord();
        const options: MatDialogConfig = {
            data: { record: newRecord,
                    fixed: null,
                    mode: 'add'
            },
            width: "80%",
        };
        if ( !isNullOrUndefined( this.id ) && !isNullOrUndefined( this.value ) )
		{
		    options.data.fixed = {}
			options.data.fixed[ this.id ] = this.value;
		}
        const dialogRef = this.dialog.open( DialogLanguageReferenceComponent, options );
        dialogRef.afterClosed().subscribe( result =>
        {
            console.log( 'addNew() dialog result ', result );
            this.tableComponent.refresh();
        } );
		return;
	}

    public editRecord( idx: number, row: LanguageReferenceRecord ): void
	{
        this.definition.dataService.lockRecord( row );
        const options: MatDialogConfig = {
            data: { record: row,
                    fixed: null,
                    LT_ID: row.LR_ID,
                    mode: 'edit'
            },
            width: "80%",
        };
        if ( !isNullOrUndefined( this.id ) && !isNullOrUndefined( this.value ) )
		{
		    options.data.fixed = {}
			options.data.fixed[ this.id ] = this.value;
		}
        const dialogRef = this.dialog.open( DialogLanguageReferenceComponent, options );
        dialogRef.afterClosed().subscribe( result =>
        {
            console.log( 'editRecord() dialog result ', result );
            this.definition.dataService.unlockRecord( row );
            this.tableComponent.refresh();
        } );
        return;
	}
}

