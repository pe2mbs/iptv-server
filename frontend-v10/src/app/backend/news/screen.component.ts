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
#   gencrud: 2021-04-04 08:26:09 version 2.1.680 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { NewsDataService } from './service';
import { NewsRecord } from './model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-news-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenNewsComponent extends GcScreenBase<NewsRecord> implements OnInit
{
    public N_ACTIVEList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];
    public N_ALERTList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];
    public N_KEEPList = [
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
               , dataService: NewsDataService
  )
    {
        super( route, dataService );
        this.row = new NewsRecord();
        this.formGroup = new FormGroup( {
            N_MESSAGE: new FormControl( this.row.N_MESSAGE || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            N_ACTIVE: new FormControl( this.row.N_ACTIVE || false,
                                              [  ]  ),
            N_ALERT: new FormControl( this.row.N_ALERT || false,
                                              [  ]  ),
            N_KEEP: new FormControl( this.row.N_KEEP || false,
                                              [  ]  ),
            N_START_DATE: new FormControl( this.row.N_START_DATE || '',
                                              [ Validators.required,  ]  ),
            N_END_DATE: new FormControl( this.row.N_END_DATE || '',
                                              [  ]  ),
            N_REMARK: new FormControl( this.row.N_REMARK || '',
                                              [  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: NewsRecord ): void
	{
		this.formGroup.patchValue( {
            N_MESSAGE: this.row.N_MESSAGE,
            N_ACTIVE: this.row.N_ACTIVE,
            N_ALERT: this.row.N_ALERT,
            N_KEEP: this.row.N_KEEP,
            N_START_DATE: this.row.N_START_DATE,
            N_END_DATE: this.row.N_END_DATE,
            N_REMARK: this.row.N_REMARK,
		} );
		return;
	}

    public get N_ID()
    {
        return ( this.row.N_ID );
    }

    public get N_MESSAGE()
    {
        return ( this.formGroup.get( 'N_MESSAGE' ) );
    }

    public get N_ACTIVE()
    {
        return ( this.formGroup.get( 'N_ACTIVE' ) );
    }

    public get N_ALERT()
    {
        return ( this.formGroup.get( 'N_ALERT' ) );
    }

    public get N_KEEP()
    {
        return ( this.formGroup.get( 'N_KEEP' ) );
    }

    public get N_START_DATE()
    {
        return ( this.formGroup.get( 'N_START_DATE' ) );
    }

    public get N_END_DATE()
    {
        return ( this.formGroup.get( 'N_END_DATE' ) );
    }

    public get N_REMARK()
    {
        return ( this.formGroup.get( 'N_REMARK' ) );
    }

}

