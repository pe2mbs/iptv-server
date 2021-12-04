/*
#
#   Python backend and Angular frontend code generation by gencrud
#   Copyright (C) 2018-2021 Marc Bertens-Nguyen m.bertens@pe2mbs.nl
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GcBaseDialog } from 'src/app/gencrud/dialog/dialog';
import { LanguageReferenceDataService } from './service';
import { GcSelectList } from 'src/app/gencrud/crud/model';
import { LanguagesDataService } from '../languages/service';
import { LanguageTranslationsDataService } from '../language_translates/service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-language_reference-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: [ '../../gencrud/dialog/dialog.scss' ]
})

export class DialogLanguageReferenceComponent extends GcBaseDialog
{
      public languagesList: GcSelectList[];
      public language_translatesList: GcSelectList[];
    constructor( dialogRef: MatDialogRef<DialogLanguageReferenceComponent>
                 , @Inject( MAT_DIALOG_DATA ) public data: any
                 , dataService: LanguageReferenceDataService
                 , public languagesService: LanguagesDataService
                 , public language_translatesService: LanguageTranslationsDataService )
    { 
        super( dialogRef, dataService, data.mode, data.fixed );
        if ( !this.isEditMode() )
        {
            data.id = 'New';
        }
        this.formGroup = new FormGroup( {
            LR_LA_ID: new FormControl( data.record.LR_LA_ID || 0,
                                              [ Validators.required,  ]  ),
            TR_TEXT: new FormControl( data.record.TR_TEXT || '',
                                              [ Validators.required,  ]  ),
            LR_LT_ID: new FormControl( data.record.LR_LT_ID || 0,
                                              [ Validators.required,  ]  ),
        } );
        this.languagesService.getSelectList( 'LA_ID', 'LA_LABEL' ).subscribe( dataList => {
            this.languagesList = dataList;
            this.updateFixedValues();
        } );
        this.language_translatesService.getSelectList( 'LT_ID', 'LT_LABEL' ).subscribe( dataList => {
            this.language_translatesList = dataList;
            this.updateFixedValues();
        } );
        this.updateFixedValues();
        return;
    }

    public get LR_ID()
    {
        return ( this.formGroup.get( 'LR_ID' ) );
    }

    public get LR_LA_ID()
    {
        return ( this.formGroup.get( 'LR_LA_ID' ) );
    }

    public get TR_TEXT()
    {
        return ( this.formGroup.get( 'TR_TEXT' ) );
    }

    public get LR_LT_ID()
    {
        return ( this.formGroup.get( 'LR_LT_ID' ) );
    }

    onSaveClick(): void
    {
        if ( !this.isEditMode() )
        {
            this.dataService.addRecord( this.formGroup.value );
        }
        else
        {
            this.dataService.updateRecord( this.formGroup.value );
        }
        super.onSaveClick();
        return;
    }
}

