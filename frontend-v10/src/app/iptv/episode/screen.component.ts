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
import { EpisodeDataService } from './service';
import { EpisodeRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { GcSelectList } from 'src/app/gencrud/crud/model';
import { SerieDataService } from '../serie/service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-episode-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenEpisodeComponent extends GcScreenBase<EpisodeRecord> implements OnInit
{
    public serieList: GcSelectList[];

    constructor( route: ActivatedRoute
               , dataService: EpisodeDataService
               , profileService: GcProfileService
                 , public serieService: SerieDataService
    )
    {
        super( 'ScreenEpisodeComponent', route, dataService, profileService );
        this.row = new EpisodeRecord();
        this.formGroup = new FormGroup( {
            IE_NAME: new FormControl( this.row.IE_NAME || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IE_GROUP: new FormControl( this.row.IE_GROUP || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IE_SEASON: new FormControl( this.row.IE_SEASON || 0,
                                              [ Validators.required,  ]  ),
            IE_EPISODE: new FormControl( this.row.IE_EPISODE || 0,
                                              [ Validators.required,  ]  ),
            IE_IS_ID: new FormControl( this.row.IE_IS_ID || 0,
                                              [ Validators.required,  ]  ),
            IE_UPDATE: new FormControl( this.row.IE_UPDATE || '',
                                              [  ]  ),
            IE_DURATION: new FormControl( this.row.IE_DURATION || 0,
                                              [  ]  ),
            IE_LINK: new FormControl( this.row.IE_LINK || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            IE_TVG_ID: new FormControl( this.row.IE_TVG_ID || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IE_TVG_LOGO: new FormControl( this.row.IE_TVG_LOGO || '',
                                              [  ]  ),
            IE_TVG_NAME: new FormControl( this.row.IE_TVG_NAME || '',
                                              [ Validators.maxLength( 64 ),  ]  ),
            IE_TVG_ATTR: new FormControl( this.row.IE_TVG_ATTR || '',
                                              [  ]  ),
            IE_LOCALE: new FormControl( this.row.IE_LOCALE || '',
                                              [ Validators.maxLength( 5 ),  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        this.registerSubscription( this.serieService.getSelectList( 'IS_ID'
                                    , 'IS_NAME'
                                     ).subscribe( dataList => {
            this.serieList = dataList;
        } ) );
        return;
    }

    protected updateFormGroup( record: EpisodeRecord ): void
	{
		this.formGroup.patchValue( {
            IE_NAME: this.row.IE_NAME,
            IE_GROUP: this.row.IE_GROUP,
            IE_SEASON: this.row.IE_SEASON,
            IE_EPISODE: this.row.IE_EPISODE,
            IE_IS_ID: this.row.IE_IS_ID,
            IE_UPDATE: this.row.IE_UPDATE,
            IE_DURATION: this.row.IE_DURATION,
            IE_LINK: this.row.IE_LINK,
            IE_TVG_ID: this.row.IE_TVG_ID,
            IE_TVG_LOGO: this.row.IE_TVG_LOGO,
            IE_TVG_NAME: this.row.IE_TVG_NAME,
            IE_TVG_ATTR: this.row.IE_TVG_ATTR,
            IE_LOCALE: this.row.IE_LOCALE,
		} );
		return;
	}

    public get IE_ID()
    {
        return ( this.row.IE_ID );
    }

    public get IE_NAME()
    {
        return ( this.formGroup.get( 'IE_NAME' ) );
    }

    public get IE_GROUP()
    {
        return ( this.formGroup.get( 'IE_GROUP' ) );
    }

    public get IE_SEASON()
    {
        return ( this.formGroup.get( 'IE_SEASON' ) );
    }

    public get IE_EPISODE()
    {
        return ( this.formGroup.get( 'IE_EPISODE' ) );
    }

    public get IE_IS_ID()
    {
        return ( this.formGroup.get( 'IE_IS_ID' ) );
    }

    public get IE_UPDATE()
    {
        return ( this.formGroup.get( 'IE_UPDATE' ) );
    }

    public get IE_DURATION()
    {
        return ( this.formGroup.get( 'IE_DURATION' ) );
    }

    public get IE_LINK()
    {
        return ( this.formGroup.get( 'IE_LINK' ) );
    }

    public get IE_TVG_ID()
    {
        return ( this.formGroup.get( 'IE_TVG_ID' ) );
    }

    public get IE_TVG_LOGO()
    {
        return ( this.formGroup.get( 'IE_TVG_LOGO' ) );
    }

    public get IE_TVG_NAME()
    {
        return ( this.formGroup.get( 'IE_TVG_NAME' ) );
    }

    public get IE_TVG_ATTR()
    {
        return ( this.formGroup.get( 'IE_TVG_ATTR' ) );
    }

    public get IE_LOCALE()
    {
        return ( this.formGroup.get( 'IE_LOCALE' ) );
    }

}

