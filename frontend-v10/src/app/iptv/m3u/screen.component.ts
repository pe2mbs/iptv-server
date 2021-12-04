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
#   gencrud: 2021-10-24 19:20:52 version 3.0.685 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { M3uDataService } from './service';
import { M3uRecord } from './model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-m3u-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenM3uComponent extends GcScreenBase<M3uRecord> implements OnInit
{

    constructor( route: ActivatedRoute
               , dataService: M3uDataService
  )
    {
        super( route, dataService );
        this.row = new M3uRecord();
        this.formGroup = new FormGroup( {
            M_TITLE: new FormControl( this.row.M_TITLE || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            M_LINK: new FormControl( this.row.M_LINK || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            M_DURATION: new FormControl( this.row.M_DURATION || 0,
                                              [ Validators.required,  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: M3uRecord ): void
	{
		this.formGroup.patchValue( {
            M_TITLE: this.row.M_TITLE,
            M_LINK: this.row.M_LINK,
            M_DURATION: this.row.M_DURATION,
		} );
		return;
	}

    public get M_ID()
    {
        return ( this.row.M_ID );
    }

    public get M_TITLE()
    {
        return ( this.formGroup.get( 'M_TITLE' ) );
    }

    public get M_LINK()
    {
        return ( this.formGroup.get( 'M_LINK' ) );
    }

    public get M_DURATION()
    {
        return ( this.formGroup.get( 'M_DURATION' ) );
    }

}

