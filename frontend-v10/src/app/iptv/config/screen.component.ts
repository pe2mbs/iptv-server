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
import { ConfigDataService } from './service';
import { ConfigRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { GcSelectList } from 'src/app/gencrud/crud/model';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-config-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenConfigComponent extends GcScreenBase<ConfigRecord> implements OnInit
{
    public IF_ENABLEDList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];
    public hide_IF_PASSWORD: boolean  = true;
    public IF_AUTHList = [
        {
            "label": "No authentication",
            "value": 0
        },
        {
            "label": "Basic authentication",
            "value": 1
        },
        {
            "label": "Digest authentication",
            "value": 2
        }
    ];

    constructor( route: ActivatedRoute
               , dataService: ConfigDataService
               , profileService: GcProfileService

    )
    {
        super( 'ScreenConfigComponent', route, dataService, profileService );
        this.row = new ConfigRecord();
        this.formGroup = new FormGroup( {
            IF_ENABLED: new FormControl( this.row.IF_ENABLED || false,
                                              [  ]  ),
            IF_NAME: new FormControl( this.row.IF_NAME || '',
                                              [ Validators.required, Validators.maxLength( 50 ),  ]  ),
            IF_LOCATION: new FormControl( this.row.IF_LOCATION || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            IF_USERNAME: new FormControl( this.row.IF_USERNAME || '',
                                              [ Validators.maxLength( 50 ),  ]  ),
            IF_PASSWORD: new FormControl( this.row.IF_PASSWORD || '',
                                              [ Validators.maxLength( 50 ),  ]  ),
            IF_AUTH: new FormControl( this.row.IF_AUTH || 0,
                                              [  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: ConfigRecord ): void
	{
		this.formGroup.patchValue( {
            IF_ENABLED: this.row.IF_ENABLED,
            IF_NAME: this.row.IF_NAME,
            IF_LOCATION: this.row.IF_LOCATION,
            IF_USERNAME: this.row.IF_USERNAME,
            IF_PASSWORD: this.row.IF_PASSWORD,
            IF_AUTH: this.row.IF_AUTH,
		} );
		return;
	}

    public get IF_ID()
    {
        return ( this.row.IF_ID );
    }

    public get IF_ENABLED()
    {
        return ( this.formGroup.get( 'IF_ENABLED' ) );
    }

    public get IF_NAME()
    {
        return ( this.formGroup.get( 'IF_NAME' ) );
    }

    public get IF_LOCATION()
    {
        return ( this.formGroup.get( 'IF_LOCATION' ) );
    }

    public get IF_USERNAME()
    {
        return ( this.formGroup.get( 'IF_USERNAME' ) );
    }

    public get IF_PASSWORD()
    {
        return ( this.formGroup.get( 'IF_PASSWORD' ) );
    }

    public get IF_AUTH()
    {
        return ( this.formGroup.get( 'IF_AUTH' ) );
    }

}

