import { Component, ViewChild, Input, OnChanges, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { isNullOrUndefined, isNull } from 'util';
import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GcFilterRecord } from './filter.record';
import { GcCrudServiceBase } from './crud.service.base';
import { GcCrudPageInfo, TableDefintion } from './model';
import { GcDeleteDialog } from '../dialog/delete.dialog';
import { GcProfileService } from '../profile/profile.service';


@Component({
  selector: 'app-cust-data-table',
  templateUrl: 'cust.data.table.component.html',
  styleUrls: [ '../common-mat-card.scss' ]
})
export class CustDataTableComponent implements OnInit, AfterViewInit, OnChanges
{
	@Input()    definition: TableDefintion<any>;  
	@Input()    id: string;
	@Input()    value: any;
    @Input()    mode: string = "edit";

	@ViewChild( MatPaginator, { static: true }) top_paginator: MatPaginator;
	@ViewChild( MatPaginator, { static: true }) bot_paginator: MatPaginator;
	@ViewChild( MatSort, { static: true }) sort: MatSort;
	protected debug: boolean = false;
	public dataService: GcCrudServiceBase<any>;
	public dataSource: MatTableDataSource<any>;
	public paginatorEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
	public filterRecord: GcFilterRecord = null;
	public resultsLength: number = 0;
	public isLoadingResults: boolean = true;
	public pageData: GcCrudPageInfo = { pageIndex: 0, pageSizeOptions: [ 5,10,20,50,100 ], pageSize: 20, filters: [] };
	public displayedColumns: string[] = null;
	public self: CustDataTableComponent;
	public filterField = '';
	constructor( protected dialog: MatDialog, private profileService: GcProfileService )
	{
		this.debug = true;
		this.self = this;
        this.dataSource = new MatTableDataSource<any>();
		return;
	}

	private isPageEvent( event: any )
	{
		const pev: PageEvent = event as PageEvent;
		return ( pev && !isNullOrUndefined( pev.pageIndex ) );
	}

	ngOnInit() 
	{		
		const filterFields = new Array<string>();
		if ( this.debug )
		{
			console.log( `mode: ${this.mode} id: ${this.id} value: ${this.value}` );
		}
		if ( this.mode === 'filter' )
		{
			// Custom filter, need to remove the column from the view
			this.filterField = this.id;
		}
		this.displayedColumns = new Array<string>();
		this.definition.columns.forEach( elem => {
			if ( this.debug )
			{
				console.log( 'ngOnChanges => ', elem );
			}
			if ( elem.display && this.filterField !== elem.columnDef )
			{
				this.displayedColumns.push( elem.header );
			}
			if ( elem.filter )
			{
				filterFields.push( elem.columnDef );
			}
        } );
        if ( !isNullOrUndefined( this.definition.defaultSortField ) )
        {
            this.pageData.sorting = {
                column: this.definition.defaultSortField,
                direction: this.definition.defaultSortDirection as 'asc' | 'desc',
                disabled: this.definition.sortDisableClear
            };
        }
        this.filterRecord = new GcFilterRecord( filterFields );
		if ( !isNullOrUndefined( this.filterRecord ) && this.mode === 'filter' )
		{
			this.filterRecord.set( this.id, this.value );
		}
		this.dataService = this.definition.dataService;
		this.pageData = this.profileService.getParam( this.definition.name, this.pageData );
        this.setPageData( this.pageData );
		return;
	}

	public ngOnChanges(): void
	{
		if ( this.debug )
		{
			console.log( 'ngOnChanges' );
		}
		if ( !isNullOrUndefined( this.filterRecord ) && this.mode === 'filter' )
		{
			this.filterRecord.set( this.id, this.value );
            this.filterRecord.event.emit();
		}
		return;
	}

	public refresh(): void
	{
		if ( this.debug )
		{
			console.log( 'GcTableBase.refresh' );
		}
		const o     = new PageEvent();
		o.pageIndex = this.top_paginator.pageIndex;
		o.pageSize  = this.top_paginator.pageSize;
		o.length    = this.top_paginator.length;
		o.previousPageIndex = this.top_paginator.pageIndex;
        this.paginatorEvent.emit( o );
		return;
	}

	protected setPaginator( paginator: MatPaginator, o: PageEvent ): void
	{
		paginator.pageIndex = o.pageIndex;
		paginator.pageSize  = o.pageSize;
		paginator.length    = o.length;
		return;
	}

	public pagingEvent( $event, source: string )
	{
		if ( source === 'top' )
		{
			this.setPaginator( this.bot_paginator, $event );
		}
		else
		{
			this.setPaginator( this.top_paginator, $event );
        }
        this.updatePageInfo( $event.pageIndex, $event.pageSize );
        this.paginatorEvent.emit( $event );
		return;
	}

    protected setPageData( o: GcCrudPageInfo ): void
	{
        console.log( 'setPageData', o );
		this.bot_paginator.pageIndex    = o.pageIndex;
		this.bot_paginator.pageSize     = o.pageSize;
		this.top_paginator.pageIndex    = o.pageIndex;
		this.top_paginator.pageSize     = o.pageSize;
        this.filterRecord.setFilters( o.filters );
        this.pageData.sorting = o.sorting;
        
        // this.sort.active    = this.pageData.sorting.column;
        // this.sort.direction = this.pageData.sorting.direction as SortDirection;
        // this.sort.disabled  = this.pageData.sorting.disabled;

        /*
        *   I managed to make it work with the following ugly hack:
        *   https://github.com/angular/components/issues/10242
        */
        const d: MatSortable = {    id:             this.pageData.sorting.column,
                                    start:          this.pageData.sorting.direction as any,
                                    disableClear:   true };
        this.sort.active = this.pageData.sorting.column;
        this.sort.sort( d );
        this.sort.active = this.pageData.sorting.column;
        this.dataSource.sort = this.sort;
        // // ugly hack!
        // const activeSortHeader = this.sort.sortables.get( this.pageData.sorting.column );
        // // tslint:disable-next-line:no-string-literal
        // activeSortHeader[ '_setAnimationTransitionState' ]({
        //     fromState: this.pageData.sorting.direction,
        //     toState: 'active',
        // });
        console.log( 'sorting change: ', d, ' TO ', this.sort );
		return;
    }
    
    private updatePageInfo( pageIndex: number, pageSize: number )
    {
        this.pageData.pageIndex         = pageIndex;
		this.pageData.pageSize          = pageSize;  
        this.pageData.filters           = this.filterRecord.getFilters();
        if ( isNullOrUndefined( this.pageData.sorting ) )
        {
            this.pageData.sorting = {
                column: this.getColumnByLabel( this.sort.active ).columnDef,
                direction: this.sort.direction as any,
                disabled: this.sort.disabled
            }
        }
        else
        {
            this.pageData.sorting.column    = this.getColumnByLabel( this.sort.active ).columnDef;
            this.pageData.sorting.direction = this.sort.direction as "desc" | "asc";
            this.pageData.sorting.disabled  = this.sort.disabled;
        }
        this.profileService.setParam( this.definition.name, this.pageData );
        return;
    }


	protected getColumnByLabel( label: string )
	{
		// tslint:disable-next-line:prefer-for-of
		for ( let idx = 0; idx < this.definition.columns.length; idx++ )
		{
			const element = this.definition.columns[ idx ];
			if ( this.debug )
			{
				console.log( "Element:", element, label );
			}
			if ( element.header === label )
			{
				return ( element );
			}
			else if ( element.columnDef === label )
			{
				return ( element );
			}
		}
		return ( this.definition.columns[ 0 ] );
	}

	public ngAfterViewInit(): void
	{
		if ( this.debug )
		{
			console.log( 'GcTableBase.ngAfterViewInit' );
		}
		merge( this.paginatorEvent, this.sort.sortChange, this.filterRecord.event )
      		.pipe( startWith( {} ),
				switchMap( ($event) => {
					if ( $event instanceof PageEvent || this.isPageEvent( $event ) )
					{
						const event = $event as PageEvent;
						if ( this.debug )
						{
							console.log( "GcTableBase.PageEvent", event );
						}
						this.pageData.pageIndex = event.pageIndex;
						this.pageData.pageSize = event.pageSize;
					}
					if ( this.debug )
					{
						console.log( `GcTableBase.req.index: ${this.pageData.pageIndex} length: ${this.resultsLength}` );
					}
                    this.isLoadingResults = true;
                    this.updatePageInfo( this.pageData.pageIndex, this.pageData.pageSize );
					return ( this.dataService.getPage( this.pageData.pageIndex,
													   this.pageData.pageSize,
													   this.pageData.sorting.direction,
													   this.pageData.sorting.column, 
													   this.filterRecord ) );
				} ),
				map( (data: any ) => {
					// Flip flag to show that loading has finished.
					this.isLoadingResults = false;
					this.resultsLength = data.recordCount;
					if ( this.debug )
					{
						console.log( `GcTableBase.map.index: ${this.pageData.pageIndex} length: ${this.resultsLength}` );
						console.log( 'GcTableBase.data.records', data.records );
						console.log( 'GcTableBase.data.recordCount', data.recordCount );
						console.log( 'GcTableBase.isLoadingResults', this.isLoadingResults );
					}
					return ( data.records );
				} ),
				catchError( err => {
					if ( err instanceof HttpErrorResponse ) 
					{
						if ( err.status === 422 || err.status === 401 ) 
						{
							// This some what brute force, just to avoid injecting the router
							window.location.href = '/#/login';
							return;
						}
					}
					console.error( "GcTableBase.catchError", err );
					this.isLoadingResults = false;
					return observableOf( [] );
				} 
			)
		).subscribe( ( data: any[] ) => {
			this.dataSource.data = data;
		} );
		return;
	}

	public deleteRecord( idx: number, row: any, id_field: string, header: string = null, fieldname: string = null ): void
	{
		if ( this.debug )
		{
			console.log( 'CustDataTableComponent.deleteRecord( idx = ', idx, 
						 ", row = ", row, 
						 ", id_field = ", id_field,
						 ", header = ", fieldname,
						 ", fieldname = ", fieldname, " )" );
		}
		this.dataService.lockRecord( row );
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.width = "auto";
		dialogConfig.data = { record: row,
			title: header,
			field: fieldname,
			id: id_field,
			value: row[ fieldname ] || null,
			mode: 'delete',
			service: this.dataService 
		};
        const dialogRef = this.dialog.open( GcDeleteDialog, dialogConfig );
        dialogRef.afterClosed().subscribe( result =>
        {
			if ( this.debug )
			{
				console.log( 'deleteItem() dialog result ', result );
			}
			this.dataService.unlockRecord( row );
            this.refresh();
		} );	
		return;
    }
    

    // private storeView(): void
    // {
    //     let sortingColumn = null;
    //     if ( !this.sort.disabled )
    //     {
    //         sortingColumn = this.getColumnByLabel( this.sort.active ).columnDef;
    //     }
    //     const data = {
    //         pageIndex:      this.pageData.pageIndex,
    //         pageSize:       this.pageData.pageSize,
    //         sortDirection:  this.sort.direction,
    //         sortColumn:     sortingColumn, 
    //         filterColumns:  this.filterRecord.getFilters()
    //     };
    //     console.log( 'storeView.data', data );

    //     sessionStorage.setItem( this.definition.name, JSON.stringify( data ) );
    //     return
    // }

    // public restoreView(): void
    // {
    //     const data = sessionStorage.getItem( this.definition.name );
    //     if ( !isNull( data ) )
    //     {
    //         const obj = JSON.parse( data );
    //         console.log( 'storeView.data', obj );
    //     }
    //     return;
    // }
}
