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
import { ChannelDataService } from './service';
import { ChannelRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { GcSelectList } from 'src/app/gencrud/crud/model';
import { BougetDataService } from '../bouget/service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-channel-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenChannelComponent extends GcScreenBase<ChannelRecord> implements OnInit
{
    public IC_ENABLEDList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];
    public bougetList: GcSelectList[];

    constructor( route: ActivatedRoute
               , dataService: ChannelDataService
               , profileService: GcProfileService
                 , public bougetService: BougetDataService
    )
    {
        super( 'ScreenChannelComponent', route, dataService, profileService );
        this.row = new ChannelRecord();
        this.formGroup = new FormGroup( {
            IC_ENABLED: new FormControl( this.row.IC_ENABLED || false,
                                              [  ]  ),
            IC_NAME: new FormControl( this.row.IC_NAME || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IC_ALIAS: new FormControl( this.row.IC_ALIAS || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IC_IB_ID: new FormControl( this.row.IC_IB_ID || 0,
                                              [ Validators.required,  ]  ),
            IC_INDEX: new FormControl( this.row.IC_INDEX || 0,
                                              [  ]  ),
            IC_UPDATE: new FormControl( this.row.IC_UPDATE || '',
                                              [  ]  ),
            IC_DURATION: new FormControl( this.row.IC_DURATION || 0,
                                              [  ]  ),
            IC_LINK: new FormControl( this.row.IC_LINK || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            IC_TVG_ID: new FormControl( this.row.IC_TVG_ID || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IC_TVG_LOGO: new FormControl( this.row.IC_TVG_LOGO || '',
                                              [  ]  ),
            IC_TVG_NAME: new FormControl( this.row.IC_TVG_NAME || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IC_TVG_ATTR: new FormControl( this.row.IC_TVG_ATTR || '',
                                              [  ]  ),
            IC_LOCALE: new FormControl( this.row.IC_LOCALE || '',
                                              [ Validators.maxLength( 5 ),  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        this.registerSubscription( this.bougetService.getSelectList( 'IB_ID'
                                    , 'IB_NAME'
                                     ).subscribe( dataList => {
            this.bougetList = dataList;
        } ) );
        return;
    }

    protected updateFormGroup( record: ChannelRecord ): void
	{
		this.formGroup.patchValue( {
            IC_ENABLED: this.row.IC_ENABLED,
            IC_NAME: this.row.IC_NAME,
            IC_ALIAS: this.row.IC_ALIAS,
            IC_IB_ID: this.row.IC_IB_ID,
            IC_INDEX: this.row.IC_INDEX,
            IC_UPDATE: this.row.IC_UPDATE,
            IC_DURATION: this.row.IC_DURATION,
            IC_LINK: this.row.IC_LINK,
            IC_TVG_ID: this.row.IC_TVG_ID,
            IC_TVG_LOGO: this.row.IC_TVG_LOGO,
            IC_TVG_NAME: this.row.IC_TVG_NAME,
            IC_TVG_ATTR: this.row.IC_TVG_ATTR,
            IC_LOCALE: this.row.IC_LOCALE,
		} );
		return;
	}

    public get IC_ID()
    {
        return ( this.row.IC_ID );
    }

    public get IC_ENABLED()
    {
        return ( this.formGroup.get( 'IC_ENABLED' ) );
    }

    public get IC_NAME()
    {
        return ( this.formGroup.get( 'IC_NAME' ) );
    }

    public get IC_ALIAS()
    {
        return ( this.formGroup.get( 'IC_ALIAS' ) );
    }

    public get IC_IB_ID()
    {
        return ( this.formGroup.get( 'IC_IB_ID' ) );
    }

    public get IC_INDEX()
    {
        return ( this.formGroup.get( 'IC_INDEX' ) );
    }

    public get IC_UPDATE()
    {
        return ( this.formGroup.get( 'IC_UPDATE' ) );
    }

    public get IC_DURATION()
    {
        return ( this.formGroup.get( 'IC_DURATION' ) );
    }

    public get IC_LINK()
    {
        return ( this.formGroup.get( 'IC_LINK' ) );
    }

    public get IC_TVG_ID()
    {
        return ( this.formGroup.get( 'IC_TVG_ID' ) );
    }

    public get IC_TVG_LOGO()
    {
        return ( this.formGroup.get( 'IC_TVG_LOGO' ) );
    }

    public get IC_TVG_NAME()
    {
        return ( this.formGroup.get( 'IC_TVG_NAME' ) );
    }

    public get IC_TVG_ATTR()
    {
        return ( this.formGroup.get( 'IC_TVG_ATTR' ) );
    }

    public get IC_LOCALE()
    {
        return ( this.formGroup.get( 'IC_LOCALE' ) );
    }

}

