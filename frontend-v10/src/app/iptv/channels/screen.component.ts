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
#   gencrud: 2021-10-24 19:21:22 version 3.0.685 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { ChannelDataService } from './service';
import { ChannelRecord } from './model';

import { GcSelectList } from 'src/app/gencrud/crud/model';
import { M3uDataService } from '../m3u/service';
import { BougetDataService } from '../bougets/service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-channels-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenChannelComponent extends GcScreenBase<ChannelRecord> implements OnInit
{
    public CH_ENABLEDList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];
    public m3uList: GcSelectList[];
    public bougetsList: GcSelectList[];

    constructor( route: ActivatedRoute
               , dataService: ChannelDataService
                 , public m3uService: M3uDataService
                 , public bougetsService: BougetDataService  )
    {
        super( route, dataService );
        this.row = new ChannelRecord();
        this.formGroup = new FormGroup( {
            CH_NUMBER: new FormControl( this.row.CH_NUMBER || 0,
                                              [  ]  ),
            CH_TITLE: new FormControl( this.row.CH_TITLE || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            CH_ENABLED: new FormControl( this.row.CH_ENABLED || false,
                                              [  ]  ),
            CH_M_ID: new FormControl( this.row.CH_M_ID || 0,
                                              [  ]  ),
            CH_B_ID: new FormControl( this.row.CH_B_ID || 0,
                                              [  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        this.registerSubscription( this.m3uService.getSelectList( 'M_ID'
                                    , 'M_TITLE'
                                     ).subscribe( dataList => {
            this.m3uList = dataList;
        } ) );
        this.registerSubscription( this.bougetsService.getSelectList( 'B_ID'
                                    , 'B_LABEL'
                                     ).subscribe( dataList => {
            this.bougetsList = dataList;
        } ) );
        return;
    }

    protected updateFormGroup( record: ChannelRecord ): void
	{
		this.formGroup.patchValue( {
            CH_NUMBER: this.row.CH_NUMBER,
            CH_TITLE: this.row.CH_TITLE,
            CH_ENABLED: this.row.CH_ENABLED,
            CH_M_ID: this.row.CH_M_ID,
            CH_B_ID: this.row.CH_B_ID,
		} );
		return;
	}

    public get CH_ID()
    {
        return ( this.row.CH_ID );
    }

    public get CH_NUMBER()
    {
        return ( this.formGroup.get( 'CH_NUMBER' ) );
    }

    public get CH_TITLE()
    {
        return ( this.formGroup.get( 'CH_TITLE' ) );
    }

    public get CH_ENABLED()
    {
        return ( this.formGroup.get( 'CH_ENABLED' ) );
    }

    public get CH_M_ID()
    {
        return ( this.formGroup.get( 'CH_M_ID' ) );
    }

    public get CH_B_ID()
    {
        return ( this.formGroup.get( 'CH_B_ID' ) );
    }

}

