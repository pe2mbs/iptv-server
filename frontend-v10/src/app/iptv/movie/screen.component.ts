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
import { MovieDataService } from './service';
import { MovieRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-movie-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenMovieComponent extends GcScreenBase<MovieRecord> implements OnInit
{
    public IM_ENABLEDList = [
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
               , dataService: MovieDataService
               , profileService: GcProfileService

    )
    {
        super( 'ScreenMovieComponent', route, dataService, profileService );
        this.row = new MovieRecord();
        this.formGroup = new FormGroup( {
            IM_ENABLED: new FormControl( this.row.IM_ENABLED || false,
                                              [  ]  ),
            IM_NAME: new FormControl( this.row.IM_NAME || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IM_STITLE: new FormControl( this.row.IM_STITLE || '',
                                              [ Validators.maxLength( 128 ),  ]  ),
            IM_GROUP: new FormControl( this.row.IM_GROUP || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IM_INDEX: new FormControl( this.row.IM_INDEX || 0,
                                              [  ]  ),
            IM_UPDATE: new FormControl( this.row.IM_UPDATE || '',
                                              [  ]  ),
            IM_DURATION: new FormControl( this.row.IM_DURATION || 0,
                                              [  ]  ),
            IM_LINK: new FormControl( this.row.IM_LINK || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            IM_TVG_ID: new FormControl( this.row.IM_TVG_ID || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IM_TVG_LOGO: new FormControl( this.row.IM_TVG_LOGO || '',
                                              [  ]  ),
            IM_TVG_NAME: new FormControl( this.row.IM_TVG_NAME || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IM_TVG_ATTR: new FormControl( this.row.IM_TVG_ATTR || '',
                                              [  ]  ),
            IM_LOCALE: new FormControl( this.row.IM_LOCALE || '',
                                              [ Validators.maxLength( 5 ),  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: MovieRecord ): void
	{
		this.formGroup.patchValue( {
            IM_ENABLED: this.row.IM_ENABLED,
            IM_NAME: this.row.IM_NAME,
            IM_STITLE: this.row.IM_STITLE,
            IM_GROUP: this.row.IM_GROUP,
            IM_INDEX: this.row.IM_INDEX,
            IM_UPDATE: this.row.IM_UPDATE,
            IM_DURATION: this.row.IM_DURATION,
            IM_LINK: this.row.IM_LINK,
            IM_TVG_ID: this.row.IM_TVG_ID,
            IM_TVG_LOGO: this.row.IM_TVG_LOGO,
            IM_TVG_NAME: this.row.IM_TVG_NAME,
            IM_TVG_ATTR: this.row.IM_TVG_ATTR,
            IM_LOCALE: this.row.IM_LOCALE,
		} );
		return;
	}

    public get IM_ID()
    {
        return ( this.row.IM_ID );
    }

    public get IM_ENABLED()
    {
        return ( this.formGroup.get( 'IM_ENABLED' ) );
    }

    public get IM_NAME()
    {
        return ( this.formGroup.get( 'IM_NAME' ) );
    }

    public get IM_STITLE()
    {
        return ( this.formGroup.get( 'IM_STITLE' ) );
    }

    public get IM_GROUP()
    {
        return ( this.formGroup.get( 'IM_GROUP' ) );
    }

    public get IM_INDEX()
    {
        return ( this.formGroup.get( 'IM_INDEX' ) );
    }

    public get IM_UPDATE()
    {
        return ( this.formGroup.get( 'IM_UPDATE' ) );
    }

    public get IM_DURATION()
    {
        return ( this.formGroup.get( 'IM_DURATION' ) );
    }

    public get IM_LINK()
    {
        return ( this.formGroup.get( 'IM_LINK' ) );
    }

    public get IM_TVG_ID()
    {
        return ( this.formGroup.get( 'IM_TVG_ID' ) );
    }

    public get IM_TVG_LOGO()
    {
        return ( this.formGroup.get( 'IM_TVG_LOGO' ) );
    }

    public get IM_TVG_NAME()
    {
        return ( this.formGroup.get( 'IM_TVG_NAME' ) );
    }

    public get IM_TVG_ATTR()
    {
        return ( this.formGroup.get( 'IM_TVG_ATTR' ) );
    }

    public get IM_LOCALE()
    {
        return ( this.formGroup.get( 'IM_LOCALE' ) );
    }

}

