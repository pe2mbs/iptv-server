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
#   gencrud: 2021-10-24 19:21:03 version 3.0.685 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { M3uAttrDataService } from './service';
import { M3uAttrRecord } from './model';

import { GcSelectList } from 'src/app/gencrud/crud/model';
import { M3uDataService } from '../m3u/service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-m3u_attr-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenM3uAttrComponent extends GcScreenBase<M3uAttrRecord> implements OnInit
{
    public m3uList: GcSelectList[];
    public MA_OVERIDEList = [
        {
            "label": "No override",
            "value": 0
        },
        {
            "label": "Channel title",
            "value": 1
        },
        {
            "label": "Bouget name",
            "value": 2
        }
    ];

    constructor( route: ActivatedRoute
               , dataService: M3uAttrDataService
                 , public m3uService: M3uDataService  )
    {
        super( route, dataService );
        this.row = new M3uAttrRecord();
        this.formGroup = new FormGroup( {
            MA_ATTRIBUTE: new FormControl( this.row.MA_ATTRIBUTE || '',
                                              [ Validators.required, Validators.maxLength( 30 ),  ]  ),
            MA_VALUE: new FormControl( this.row.MA_VALUE || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            MA_M_ID: new FormControl( this.row.MA_M_ID || 0,
                                              [ Validators.required,  ]  ),
            MA_OVERIDE: new FormControl( this.row.MA_OVERIDE || 0,
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
        return;
    }

    protected updateFormGroup( record: M3uAttrRecord ): void
	{
		this.formGroup.patchValue( {
            MA_ATTRIBUTE: this.row.MA_ATTRIBUTE,
            MA_VALUE: this.row.MA_VALUE,
            MA_M_ID: this.row.MA_M_ID,
            MA_OVERIDE: this.row.MA_OVERIDE,
		} );
		return;
	}

    public get MA_ID()
    {
        return ( this.row.MA_ID );
    }

    public get MA_ATTRIBUTE()
    {
        return ( this.formGroup.get( 'MA_ATTRIBUTE' ) );
    }

    public get MA_VALUE()
    {
        return ( this.formGroup.get( 'MA_VALUE' ) );
    }

    public get MA_M_ID()
    {
        return ( this.formGroup.get( 'MA_M_ID' ) );
    }

    public get MA_OVERIDE()
    {
        return ( this.formGroup.get( 'MA_OVERIDE' ) );
    }

}

