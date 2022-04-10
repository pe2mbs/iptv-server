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
import { ReplaceDataService } from './service';
import { ReplaceRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-replace-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenReplaceComponent extends GcScreenBase<ReplaceRecord> implements OnInit
{

    constructor( route: ActivatedRoute
               , dataService: ReplaceDataService
               , profileService: GcProfileService

    )
    {
        super( 'ScreenReplaceComponent', route, dataService, profileService );
        this.row = new ReplaceRecord();
        this.formGroup = new FormGroup( {
            IR_FIND: new FormControl( this.row.IR_FIND || '',
                                              [ Validators.required, Validators.maxLength( 128 ),  ]  ),
            IR_REPLACE: new FormControl( this.row.IR_REPLACE || '',
                                              [ Validators.required, Validators.maxLength( 128 ),  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: ReplaceRecord ): void
	{
		this.formGroup.patchValue( {
            IR_FIND: this.row.IR_FIND,
            IR_REPLACE: this.row.IR_REPLACE,
		} );
		return;
	}

    public get IR_ID()
    {
        return ( this.row.IR_ID );
    }

    public get IR_FIND()
    {
        return ( this.formGroup.get( 'IR_FIND' ) );
    }

    public get IR_REPLACE()
    {
        return ( this.formGroup.get( 'IR_REPLACE' ) );
    }

}

