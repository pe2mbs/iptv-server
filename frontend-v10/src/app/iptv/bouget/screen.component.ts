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
#   gencrud: 2022-04-10 21:02:17 version 3.0.685 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { BougetDataService } from './service';
import { BougetRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-bouget-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenBougetComponent extends GcScreenBase<BougetRecord> implements OnInit
{
    public IB_ENABLEDList = [
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
               , dataService: BougetDataService
               , profileService: GcProfileService

    )
    {
        super( 'ScreenBougetComponent', route, dataService, profileService );
        this.row = new BougetRecord();
        this.formGroup = new FormGroup( {
            IB_ENABLED: new FormControl( this.row.IB_ENABLED || false,
                                              [  ]  ),
            IB_NAME: new FormControl( this.row.IB_NAME || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IB_ALIAS: new FormControl( this.row.IB_ALIAS || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IB_INDEX: new FormControl( this.row.IB_INDEX || 0,
                                              [  ]  ),
            IB_UPDATE: new FormControl( this.row.IB_UPDATE || '',
                                              [  ]  ),
            IB_LOCALE: new FormControl( this.row.IB_LOCALE || '',
                                              [ Validators.maxLength( 5 ),  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: BougetRecord ): void
	{
		this.formGroup.patchValue( {
            IB_ENABLED: this.row.IB_ENABLED,
            IB_NAME: this.row.IB_NAME,
            IB_ALIAS: this.row.IB_ALIAS,
            IB_INDEX: this.row.IB_INDEX,
            IB_UPDATE: this.row.IB_UPDATE,
            IB_LOCALE: this.row.IB_LOCALE,
		} );
		return;
	}

    public get IB_ID()
    {
        return ( this.row.IB_ID );
    }

    public get IB_ENABLED()
    {
        return ( this.formGroup.get( 'IB_ENABLED' ) );
    }

    public get IB_NAME()
    {
        return ( this.formGroup.get( 'IB_NAME' ) );
    }

    public get IB_ALIAS()
    {
        return ( this.formGroup.get( 'IB_ALIAS' ) );
    }

    public get IB_INDEX()
    {
        return ( this.formGroup.get( 'IB_INDEX' ) );
    }

    public get IB_UPDATE()
    {
        return ( this.formGroup.get( 'IB_UPDATE' ) );
    }

    public get IB_LOCALE()
    {
        return ( this.formGroup.get( 'IB_LOCALE' ) );
    }

}

