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
#   gencrud: 2022-04-10 21:02:18 version 3.0.685 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { SerieDataService } from './service';
import { SerieRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-serie-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenSerieComponent extends GcScreenBase<SerieRecord> implements OnInit
{
    public IS_ENABLEDList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];

    constructor( route: ActivatedRoute
               , dataService: SerieDataService
               , profileService: GcProfileService

    )
    {
        super( 'ScreenSerieComponent', route, dataService, profileService );
        this.row = new SerieRecord();
        this.formGroup = new FormGroup( {
            IS_ENABLED: new FormControl( this.row.IS_ENABLED || false,
                                              [  ]  ),
            IS_NAME: new FormControl( this.row.IS_NAME || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IS_INDEX: new FormControl( this.row.IS_INDEX || 0,
                                              [  ]  ),
            IS_LOCALE: new FormControl( this.row.IS_LOCALE || '',
                                              [ Validators.maxLength( 5 ),  ]  ),
            IS_UPDATE: new FormControl( this.row.IS_UPDATE || '',
                                              [  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: SerieRecord ): void
	{
		this.formGroup.patchValue( {
            IS_ENABLED: this.row.IS_ENABLED,
            IS_NAME: this.row.IS_NAME,
            IS_INDEX: this.row.IS_INDEX,
            IS_LOCALE: this.row.IS_LOCALE,
            IS_UPDATE: this.row.IS_UPDATE,
		} );
		return;
	}

    public get IS_ID()
    {
        return ( this.row.IS_ID );
    }

    public get IS_ENABLED()
    {
        return ( this.formGroup.get( 'IS_ENABLED' ) );
    }

    public get IS_NAME()
    {
        return ( this.formGroup.get( 'IS_NAME' ) );
    }

    public get IS_INDEX()
    {
        return ( this.formGroup.get( 'IS_INDEX' ) );
    }

    public get IS_LOCALE()
    {
        return ( this.formGroup.get( 'IS_LOCALE' ) );
    }

    public get IS_UPDATE()
    {
        return ( this.formGroup.get( 'IS_UPDATE' ) );
    }

}

