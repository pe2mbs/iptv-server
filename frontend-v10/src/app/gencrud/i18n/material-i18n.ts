import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';


@Injectable()
export class GcMatPaginatorIntl extends MatPaginatorIntl 
{
  	itemsPerPageLabel 	= 'Items per page';
  	nextPageLabel     	= 'Next page';
	previousPageLabel 	= 'Previous page';
	rangeLabelIntl		= "of";
	firstPageLabel		= "First page";
    lastPageLabel		= "Last page";
	constructor( private translateService: TranslateService ) 
	{
		super();
		this.translateService.onLangChange.subscribe( () => {
			this.getTranslations();
		} );
		return;
	}

	public getTranslations(): void 
	{
		this.translateService.get( [ 'Items per page',
									 'Next page',
									 'Previous page',
									 "First page",
									 "Last page",
		  							 'Page range' ] ).subscribe( translation => {
			this.itemsPerPageLabel 	= translation[ 'Items per page' ];
			this.nextPageLabel 		= translation[ 'Next page' ];
			this.previousPageLabel 	= translation[ 'Previous page' ];
			this.rangeLabelIntl		= translation[ 'Page range' ];
			this.firstPageLabel 	= translation[ "First page" ];
			this.lastPageLabel 		= translation[ "Last page" ];
			this.changes.next();
			console.log( 'MyMatPaginatorIntl.getTranslations' );
		} );
		return;
	}

	getRangeLabel = function( page: number, pageSize: number, length: number )
	{
		if ( length === 0 || pageSize === 0 ) 
		{
      		return ( `0 ${this.rangeLabelIntl} ${length}` );
    	}
    	length = Math.max(length, 0);
    	const startIndex = page * pageSize;
    	// If the start index exceeds the list length, do not try and fix the end index to the end.
    	const endIndex = startIndex < length ?
      			Math.min( startIndex + pageSize, length ) : startIndex + pageSize;
		// return startIndex + 1 + ' - ' + endIndex + ' ' + this.rangeLabelIntl + ' ' + length;
		return ( `${startIndex + 1} - ${endIndex} ${this.rangeLabelIntl} ${length}` );
  	};
}
