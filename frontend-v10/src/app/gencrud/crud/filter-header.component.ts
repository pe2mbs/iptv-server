import { Component, EventEmitter, Input, ChangeDetectionStrategy, Output,  OnInit } from '@angular/core';
import { Directive, HostListener } from "@angular/core";
import { isNullOrUndefined } from 'util';
import { GcConditionItem } from './model';
import { GcFilterRecord, GcFilterEvent } from './filter.record';


export const CONDITIONS_LIST_SIMPLE: GcConditionItem[] = [
	{ value: "EQ", 		label: "Is equal ==", param: 0 },
	{ value: "!EQ", 	label: "Is not equal !=", param: 0 },
];


export const CONDITIONS_LIST: GcConditionItem[] = [
	{ value: "EQ", 		label: "Is equal ==", param: 1 },
	{ value: "!EQ", 	label: "Is not equal !=", param: 1 },
	{ value: "GT", 		label: "Greater than >", param: 1 },
	{ value: "GT|EQ",	label: "Greater or equal than >=", param: 1 },
	{ value: "LE", 		label: "Less than <", param: 1 },
	{ value: "LE|EQ",	label: "Less or equal than <=", param: 1 },
	{ value: "BT",		label: "Between", param: 2 },
	{ value: "SW",		label: "Startswith", param: 1 },
	{ value: "EW",		label: "Endswith", param: 1 },
	{ value: "CO",		label: "Contains", param: 1 },
	{ value: "!CO",		label: "Not contains", param: 1 },
	{ value: "EM", 		label: "Is empty", param: -1 },
	{ value: "!EM", 	label: "Is not empty", param: -1 },
];


export const CONDITION_FIELDS = {
	// Default value is 1
	"BT": 2,
	"EM": 0,
	"!EM": 0,
};


@Directive( {
	// tslint:disable-next-line:directive-selector
	selector: "[mat-filter-item]"
} )
export class GcFilterItemDirective
{
	@HostListener( "click", [ "$event" ] ) onClick( e: MouseEvent )
	{
    	e.stopPropagation();
    	e.preventDefault();
    	return false;
  	}
}


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    // tslint:disable-next-line:component-selector
    selector: 'filter-header',
	templateUrl: 'filter-header.component.html',
	styles: [ `.cond_option { font-size: inherit; line-height: 1.5em!important; height: 1.5em!important; }`,
				'.action-button { width: 50px; margin-left: 5px; margin-right: 5px;  }',
				'.title-highlight { font-weight: bolder; }'
	]
} )
export class GcFilterHeaderComponent implements OnInit
{
	public 		conditionsList: GcConditionItem[];
	public 		conditionPosition: string;
	public 		value: string[] = new Array<string>( 2 );
	public 		valuePosition: number = null;
	public 		caption: string[] = [ 'Value', 'Max. value' ];
	public 		fields: number = 1;
	public		title_filter = ""; 
	@Input()	title: string;
	@Input()	field: string;
	@Input()	items: [];
	@Input()	filterRecord: GcFilterRecord;
	@Output()	applyFilter: EventEmitter<GcFilterEvent> = new EventEmitter<GcFilterEvent>();

	constructor()
	{
		return;
	}

	public ngOnInit(): void 
	{
		if ( isNullOrUndefined( this.items ) )
		{
			this.fields = 1;
			this.conditionsList = CONDITIONS_LIST;
		}
		else
		{
			this.conditionsList = CONDITIONS_LIST_SIMPLE;
			this.fields = 0;
		}
		return;
	}
	
	public selectValue( $event ): void
	{
		console.log( "selectValue", $event );
		return;
	}

	private findConditionItem( value: string ): GcConditionItem
	{
		let item: GcConditionItem = null;
		this.conditionsList.forEach( element => {
			if ( element.value === value )
			{
				item = element;
				return;
			}
		} );
		return ( item );
	}

	public selectCondition( $event ): void
	{
		console.log( "selectCondition", $event, this.conditionPosition, this.items );
		if ( !isNullOrUndefined( this.items ) )
		{
			this.fields = 0;
		}
		else
		{
			this.fields = 1;
			this.caption[ 0 ] = 'Value';
			const item = this.findConditionItem( $event.value );
			console.log( 'item', item ) ;
			this.fields = item.param;
			if ( this.fields === 2 )
			{
				this.caption[ 0 ] = 'Min. Value';
			}
		}
		return;
	}

	public clearColumnFilter(): void
	{
		this.value = [ null, null ];
		this.conditionPosition = null;
		this.filterRecord.clear( this.field );
		this.title_filter = "";
		const e = new GcFilterEvent();
		e.filter = null;
		this.valuePosition = null;
		this.filterRecord.event.emit( e );
		return;
	}

	public applyColumnFilter(): void 
	{
		if ( isNullOrUndefined( this.items ) )
		{
			this.filterRecord.apply( this.field, 
									 this.value, 
									 this.conditionPosition );
		}									 
		else
		{
			this.filterRecord.apply( this.field, 
									 [ this.valuePosition, null ], 
									 this.conditionPosition );
		}
		this.applyFilter.emit( { filter: this.filterRecord } );
		if ( this.filterRecord.event != null )
		{
			const e = new GcFilterEvent();
			e.filter = this.filterRecord;
			this.filterRecord.event.emit( e );
		}
		this.title_filter = "title-highlight";
		return;
	}
}
