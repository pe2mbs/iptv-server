/*
#
#   Python backend and Angular frontend code generation by gencrud
#   Copyright (C) 2018-2020 Marc Bertens-Nguyen m.bertens@pe2mbs.nl
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
*/
import { Component,
         Input, 
         forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, 
         FormGroupDirective } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GcBaseComponent } from './base.input.component';
import { Router } from '@angular/router';


export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef( () => GcChoiceAutoInputComponent ),
    multi: true
};

@Component( {
    // tslint:disable-next-line:component-selector
    selector: 'gc-choice-autocomplete-input',
    template: `<div class="form">
        <ng-select class="ng-select" id="{{ id }}" [items]="items" [(ngModel)]="itemValue" [readonly]="readonly"
                                        [placeholder]="placeholder" [multiple]="false">
            <ng-template *ngIf="detail_id != null" ng-header-tmp>
                <div>
                    <button mat-icon-button aria-label="Edit details" color="primary" matTooltip="Edit {{ placeholder }}"
                                            (click)="routeToDetail()">
                        <mat-icon>open_in_new</mat-icon>
                    </button>
                </div>
            </ng-template>
        </ng-select>
</div>`,
    styleUrls: [ 'choice.scss' ],
    providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ],
    animations: [ trigger(
        'visibilityChanged', [
            state( 'true', style( { 'height': '*', 'padding-top': '4px' } ) ),
            state( 'false', style( { height: '0px', 'padding-top': '0px' } ) ),
            transition( '*=>*', animate( '200ms' ) )
        ]
    ) ]
} )
export class GcChoiceAutoInputComponent extends GcBaseComponent
{
    @Input() items;
    public selected: any;
    @Input() detail_button: string = null;
    @Input() detail_id: string = null;

    constructor( formGroupDir: FormGroupDirective, public router: Router )
    {
        super( formGroupDir );
        return;
    }

    public routeToDetail()
    {
        this.router.navigate( [ this.detail_button ], { queryParams: { id: this.detail_id,
                                                                       value: this.control.value,
                                                                       mode: 'edit' } } );
        return;
    }

    public get itemValue()
    {
        let result  = this.control.value;
        if ( Array.isArray( this.items ) )
        {
            this.items.forEach(element => {
                if ( element.value === this.control.value )
                {
                    result = element.label;
                    return;
                }
            });
        }
        return ( result );
    }

    public set itemValue( value )
    {
        this.control.setValue( value.value );
        return;
    }
}
