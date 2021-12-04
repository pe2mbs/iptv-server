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
#   gencrud: 2021-04-04 08:26:10 version 2.1.680 by user mbertens
*/
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GcScreenBase } from 'src/app/gencrud/crud/crud.screen.base';
import { UserDataService } from './service';
import { UserRecord } from './model';

import { GcSelectList } from 'src/app/gencrud/crud/model';
import { RoleDataService } from '../role/service';
import { LanguagesDataService } from '../languages/service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-user-screen',
    templateUrl: './screen.component.html',
    styleUrls: [ '../../gencrud/common-mat-card.scss' ]
})
export class ScreenUserComponent extends GcScreenBase<UserRecord> implements OnInit
{
    public U_ACTIVEList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];
    public roleList: GcSelectList[];
    public hide_U_HASH_PASSWORD: boolean  = true;
    public U_MUST_CHANGEList = [
        {
            "label": "Yes",
            "value": true
        },
        {
            "label": "No",
            "value": false
        }
    ];
    public languagesList: GcSelectList[];
    public U_LISTITEMSList = [
        {
            "label": "5 Records",
            "value": 5
        },
        {
            "label": "10 Records",
            "value": 10
        },
        {
            "label": "25 Records",
            "value": 25
        },
        {
            "label": "100 Records",
            "value": 100
        }
    ];

    constructor( route: ActivatedRoute
               , dataService: UserDataService
                 , public roleService: RoleDataService
                 , public languagesService: LanguagesDataService  )
    {
        super( route, dataService );
        this.row = new UserRecord();
        this.formGroup = new FormGroup( {
            U_ACTIVE: new FormControl( this.row.U_ACTIVE || false,
                                              [  ]  ),
            U_NAME: new FormControl( this.row.U_NAME || '',
                                              [ Validators.required, Validators.maxLength( 30 ),  ]  ),
            U_ROLE: new FormControl( this.row.U_ROLE || 0,
                                              [  ]  ),
            U_HASH_PASSWORD: new FormControl( this.row.U_HASH_PASSWORD || '',
                                              [ Validators.required, Validators.maxLength( 255 ),  ]  ),
            U_MUST_CHANGE: new FormControl( this.row.U_MUST_CHANGE || false,
                                              [  ]  ),
            U_FIRST_NAME: new FormControl( this.row.U_FIRST_NAME || '',
                                              [ Validators.required, Validators.maxLength( 50 ),  ]  ),
            U_MIDDLE_NAME: new FormControl( this.row.U_MIDDLE_NAME || '',
                                              [ Validators.maxLength( 50 ),  ]  ),
            U_LAST_NAME: new FormControl( this.row.U_LAST_NAME || '',
                                              [ Validators.required, Validators.maxLength( 50 ),  ]  ),
            U_EMAIL: new FormControl( this.row.U_EMAIL || '',
                                              [ Validators.required, Validators.maxLength( 100 ),  ]  ),
            U_REMARK: new FormControl( this.row.U_REMARK || '',
                                              [  ]  ),
            U_LOCALE: new FormControl( this.row.U_LOCALE || 0,
                                              [  ]  ),
            U_LISTITEMS: new FormControl( this.row.U_LISTITEMS || 0,
                                              [  ]  ),
            U_PROFILE: new FormControl( this.row.U_PROFILE || '',
                                              [  ]  ),
        } );
        return;
    }

    ngOnInit()
    {
        super.ngOnInit();
        this.registerSubscription( this.roleService.getSelectList( 'R_ID'
                                    , 'R_ROLE'
                                     ).subscribe( dataList => {
            this.roleList = dataList;
        } ) );
        this.registerSubscription( this.languagesService.getSelectList( 'LA_ID'
                                    , 'LA_LABEL'
                                     ).subscribe( dataList => {
            this.languagesList = dataList;
        } ) );
        return;
    }

    protected updateFormGroup( record: UserRecord ): void
	{
		this.formGroup.patchValue( {
            U_ACTIVE: this.row.U_ACTIVE,
            U_NAME: this.row.U_NAME,
            U_ROLE: this.row.U_ROLE,
            U_HASH_PASSWORD: this.row.U_HASH_PASSWORD,
            U_MUST_CHANGE: this.row.U_MUST_CHANGE,
            U_FIRST_NAME: this.row.U_FIRST_NAME,
            U_MIDDLE_NAME: this.row.U_MIDDLE_NAME,
            U_LAST_NAME: this.row.U_LAST_NAME,
            U_EMAIL: this.row.U_EMAIL,
            U_REMARK: this.row.U_REMARK,
            U_LOCALE: this.row.U_LOCALE,
            U_LISTITEMS: this.row.U_LISTITEMS,
            U_PROFILE: this.row.U_PROFILE,
		} );
		return;
	}

    public get U_ID()
    {
        return ( this.row.U_ID );
    }

    public get U_ACTIVE()
    {
        return ( this.formGroup.get( 'U_ACTIVE' ) );
    }

    public get U_NAME()
    {
        return ( this.formGroup.get( 'U_NAME' ) );
    }

    public get U_ROLE()
    {
        return ( this.formGroup.get( 'U_ROLE' ) );
    }

    public get U_HASH_PASSWORD()
    {
        return ( this.formGroup.get( 'U_HASH_PASSWORD' ) );
    }

    public get U_MUST_CHANGE()
    {
        return ( this.formGroup.get( 'U_MUST_CHANGE' ) );
    }

    public get U_FIRST_NAME()
    {
        return ( this.formGroup.get( 'U_FIRST_NAME' ) );
    }

    public get U_MIDDLE_NAME()
    {
        return ( this.formGroup.get( 'U_MIDDLE_NAME' ) );
    }

    public get U_LAST_NAME()
    {
        return ( this.formGroup.get( 'U_LAST_NAME' ) );
    }

    public get U_EMAIL()
    {
        return ( this.formGroup.get( 'U_EMAIL' ) );
    }

    public get U_REMARK()
    {
        return ( this.formGroup.get( 'U_REMARK' ) );
    }

    public get U_LOCALE()
    {
        return ( this.formGroup.get( 'U_LOCALE' ) );
    }

    public get U_LISTITEMS()
    {
        return ( this.formGroup.get( 'U_LISTITEMS' ) );
    }

    public get U_PROFILE()
    {
        return ( this.formGroup.get( 'U_PROFILE' ) );
    }

}

