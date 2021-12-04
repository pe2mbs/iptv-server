import { FormGroup, FormControl } from '@angular/forms';
import { OnInit, Input, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GcCrudServiceBase } from './crud.service.base';
import { GcSubscribers } from '../subscribers';


@Component( {
	template: ''
} )
// tslint:disable-next-line:component-class-suffix
export class GcScreenBase<T> extends GcSubscribers implements OnInit, OnDestroy
{
	@Input()	id: number;
	@Input()	value: any;
	@Input()	mode: string;	// edit, add, filter
	public row: T;
	public formGroup: FormGroup;
	public formControl: FormControl;
	public sub: any;
	protected fixedValues: any = null;
	protected debug: boolean = false;

	constructor( protected route: ActivatedRoute
			   , public dataService: GcCrudServiceBase<T> )
	{
		super();
		return;
	}

	protected updateFormGroup( record: T ): void
	{
		return;
	}

	ngOnInit()
    {
        if ( this.id === undefined || this.id === null )
        {
            this.registerSubscription( this.route.queryParams.subscribe( params => {
                console.log( params );
                this.id             = params.id;    // Contains the key field, currently only the primary key is supported.
                this.value          = params.value; // Contains val value for the key field.
                this.mode           = params.mode;  // edit or new, filter only supported on the table component.
                this.updateFixedValues( params );
            } ) );
        }
        if ( this.value != null || this.value !== undefined )
        {
            this.registerSubscription( this.dataService.getRecordById( this.value ).subscribe( record => {
				this.row = record;
				this.updateFormGroup( this.row );
                this.updateFixedValues();
                this.dataService.lockRecord( this.row );
            } ) );
        }
        return;
	}
	
	public ngOnDestroy()
    {
		this.dataService.unlockRecord( this.row );
        super.ngOnDestroy();
        return;
    }

	protected updateFixedValues( fixed_values: any = null ): void
    {
        if ( fixed_values != null )
        {
            this.fixedValues = fixed_values;
        }
        if ( this.fixedValues != null )
        {
            for ( const key in this.fixedValues )
            {
                if ( key.endsWith( '_ID' ) )
                {
                    const value: number = +this.fixedValues[ key ];
                    const ctrl = this.formGroup.get( key );
                    if ( ctrl != null )
                    {
                        ctrl.setValue( value );
                        if ( !this.editMode )
                        {
                            ctrl.disable( { onlySelf: true } );
                        }
                    }
                }
            }
        }
        return;
    }

	public get editMode(): boolean
    {
        return ( this.mode === 'edit' );
	}

	public onCancelClick(): void 
	{
		this.dataService.unlockRecord( this.row );
        window.history.back();
        return;		
	}
	
	public onSaveClick(): void 
	{
		if ( !this.editMode )
        {
            if ( this.fixedValues != null )
            {
                for ( const key in this.fixedValues )
                {
                    if ( key.endsWith( '_ID' ) )
                    {
                        const value: number = +this.fixedValues[ key ];
                        const ctrl = this.formGroup.get( key );
                        if ( ctrl != null )
                        {
                            ctrl.enable( { onlySelf: true } );
                            ctrl.setValue( value );
                        }
                    }
                }
            }
            this.dataService.addRecord( this.formGroup.value );
        }
        else
        {
            this.dataService.updateRecord( this.formGroup.value );
		}
		this.dataService.unlockRecord( this.row );
        window.history.back();
		return;
	}
}
