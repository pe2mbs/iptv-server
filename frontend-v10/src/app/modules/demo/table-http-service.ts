import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackingRecord } from './model';
import { GcCrudServiceBase } from 'src/app/gencrud/crud/crud.service.base';


@Injectable()
export class ExampleHttpDatabase extends GcCrudServiceBase<TrackingRecord>
{
	/** An example database that the data source uses to retrieve data for the table. */
	constructor( _httpClient: HttpClient ) 
	{
		super( _httpClient, 'tracking' );
		return;
	}
}

