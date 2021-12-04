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
#   gencrud: 2021-10-24 19:21:17 version 3.0.685 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { BougetDataService } from './service';
import { BougetRecord } from './model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-bougets-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenBougetComponent extends GcScreenBase<BougetRecord> implements OnInit
{

    constructor( route: ActivatedRoute
               , dataService: BougetDataService
  )
    {
        super( route, dataService );
        this.row = new BougetRecord();
        this.formGroup = new FormGroup( {
            B_LABEL: new FormControl( this.row.B_LABEL || '',
                                              [ Validators.required, Validators.maxLength( 30 ),  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        return;
    }

    protected updateFormGroup( record: BougetRecord ): void
	{
		this.formGroup.patchValue( {
            B_LABEL: this.row.B_LABEL,
		} );
		return;
	}

    public get B_ID()
    {
        return ( this.row.B_ID );
    }

    public get B_LABEL()
    {
        return ( this.formGroup.get( 'B_LABEL' ) );
    }

}

