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
import { LanguagesDataService } from './service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-languages-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: [ '../../gencrud/dialog/dialog.scss' ]
})

export class DialogLanguagesComponent extends GcBaseDialog
{
    constructor( dialogRef: MatDialogRef<DialogLanguagesComponent>
                 , @Inject( MAT_DIALOG_DATA ) public data: any
                 , dataService: LanguagesDataService
 )
    { 
        super( dialogRef, dataService, data.mode, data.fixed );
        if ( !this.isEditMode() )
        {
            data.id = 'New';
        }
        this.formGroup = new FormGroup( {
            LA_LABEL: new FormControl( data.record.LA_LABEL || '',
                                              [ Validators.required, Validators.maxLength( 30 ),  ]  ),
            LA_CODE2: new FormControl( data.record.LA_CODE2 || '',
                                              [ Validators.required, Validators.maxLength( 2 ),  ]  ),
            LA_CODE3: new FormControl( data.record.LA_CODE3 || '',
                                              [ Validators.required, Validators.maxLength( 3 ),  ]  ),
            LA_COUNTRY_CODE2: new FormControl( data.record.LA_COUNTRY_CODE2 || '',
                                              [ Validators.required, Validators.maxLength( 2 ),  ]  ),
            LA_COUNTRY_CODE3: new FormControl( data.record.LA_COUNTRY_CODE3 || '',
                                              [ Validators.required, Validators.maxLength( 3 ),  ]  ),
        } );
        this.updateFixedValues();
        return;
    }

    public get LA_ID()
    {
        return ( this.formGroup.get( 'LA_ID' ) );
    }

    public get LA_LABEL()
    {
        return ( this.formGroup.get( 'LA_LABEL' ) );
    }

    public get LA_CODE2()
    {
        return ( this.formGroup.get( 'LA_CODE2' ) );
    }

    public get LA_CODE3()
    {
        return ( this.formGroup.get( 'LA_CODE3' ) );
    }

    public get LA_COUNTRY_CODE2()
    {
        return ( this.formGroup.get( 'LA_COUNTRY_CODE2' ) );
    }

    public get LA_COUNTRY_CODE3()
    {
        return ( this.formGroup.get( 'LA_COUNTRY_CODE3' ) );
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

