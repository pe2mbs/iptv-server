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
import { AliasDataService } from './service';
import { AliasRecord } from './model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-alias-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenAliasComponent extends GcScreenBase<AliasRecord> implements OnInit
{

    constructor( route: ActivatedRoute
               , dataService: AliasDataService
               , profileService: GcProfileService

    )
    {
        super( 'ScreenAliasComponent', route, dataService, profileService );
        this.row = new AliasRecord();
        this.formGroup = new FormGroup( {
            IA_NAME: new FormControl( this.row.IA_NAME || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IA_ALIAS: new FormControl( this.row.IA_ALIAS || '',
                                              [ Validators.required, Validators.maxLength( 64 ),  ]  ),
            IA_INDEX: new FormControl( this.row.IA_INDEX || 0,
                                              [  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: AliasRecord ): void
	{
		this.formGroup.patchValue( {
            IA_NAME: this.row.IA_NAME,
            IA_ALIAS: this.row.IA_ALIAS,
            IA_INDEX: this.row.IA_INDEX,
		} );
		return;
	}

    public get IA_ID()
    {
        return ( this.row.IA_ID );
    }

    public get IA_NAME()
    {
        return ( this.formGroup.get( 'IA_NAME' ) );
    }

    public get IA_ALIAS()
    {
        return ( this.formGroup.get( 'IA_ALIAS' ) );
    }

    public get IA_INDEX()
    {
        return ( this.formGroup.get( 'IA_INDEX' ) );
    }

}

