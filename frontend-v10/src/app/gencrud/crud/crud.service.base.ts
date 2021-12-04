import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GcPagingRequest, GcPagingData, GcSelectList } from './model';
import { GcBackendError } from './backend.error';
import { tap } from 'rxjs/operators';
import { GcFilterRecord } from './filter.record';
import { Injectable } from '@angular/core';


class ObservableService<T>
{
	public api: string;
	public debug: boolean = false;
	public _locked: boolean = false;
	public recordData: T;
	public _backend_filter: string = null;

	constructor( public httpClient: HttpClient, api: string )
    {
		this.api = `/api/${api}`;
        return;
	}
	
	/** CRUD METHODS */
	public getPage( page: number, 
		size: number, 
		sort_direction: string,
		sort_column: string, 
		filterRecord: GcFilterRecord ): Observable<GcPagingData> 
	{
		const pagingRequest: GcPagingRequest = {
			pageIndex: page,
			pageSize: size,
		};
		if ( sort_column != null && sort_direction != null )
		{
			pagingRequest.sorting = {
				column: sort_column,
				direction: sort_direction
			};
		}
		if ( filterRecord != null )
		{	
			pagingRequest.filters = filterRecord.getFilters();
		}
		if ( this.debug )
		{
			console.log( "pagingRequest", pagingRequest );
		}
		return this.httpClient.post<GcPagingData>( `${this.api}/pagedlist`, 
										  			pagingRequest );
	}

	public deleteRecord( record_id: number ): void
	{
		if ( this.debug )
		{
			console.log( 'deleteRecord', record_id );
		}
		this.httpClient.delete<T>( this.api + '/' + record_id ).subscribe( result => {
			if ( this.debug )
			{
				console.log ( result );
			}
		},
		(error: HttpErrorResponse) => {
			throw new GcBackendError( error.message, error.error );
		} );
		return;
	}

 	public list( _backend_filter: any ): Observable<T[]>
	{
		let uri = '/list';
		if ( _backend_filter !== null )
		{
			this._backend_filter = _backend_filter;
			uri += '/' + _backend_filter.id + '/' + _backend_filter.value;
		}
		return this.httpClient.get<T[]>( this.api + uri );
	}

	public getSelectListSimple( value: string, label: string, initial: any = null, final: any = null ): Observable<GcSelectList[]>
	{
		const listParams = new HttpParams().set('label', label ).set('value', value );
		if ( initial != null )
		{
			listParams.set( 'initial', initial );
		}
		if ( final != null )
		{
			listParams.set( 'final', final );
		}
		return this.httpClient.get<GcSelectList[]>( this.api + '/select', { params: listParams } );
	}


	public getSelectList( value: string, label: string, initial: any = null, final: any = null ): Observable<GcSelectList[]>
	{
		const listParams = new HttpParams().set('label', label ).set('value', value );
		if ( initial != null )
		{
			listParams.set( 'initial', initial );
		}
		if ( final != null )
		{
			listParams.set( 'final', final );
		}
		return ( Observable.create( observer => {
			this.httpClient.get<GcSelectList[]>( this.api + '/select', { params: listParams } )
			.subscribe( ( data ) => {
					if ( this.debug )
					{
						console.log( 'getSelectList() => ', data );
					}
					observer.next( data );
					observer.complete();
				},
				( error: HttpErrorResponse ) => {
					throw new GcBackendError( error.message, error.error );
				}
			);
		} ) );
	}

	public getSelectionList( value: string, label: string, initial: any = null, final: any = null ): Observable<Array<string>>
	{
		const listParams = new HttpParams().set('label', label ).set('value', value );
		if ( initial != null )
		{
			listParams.set( 'initial', initial );
		}
		if ( final != null )
		{
			listParams.set( 'final', final );
		}
		return ( Observable.create( observer => {
			this.httpClient.get<GcSelectList[]>( this.api + '/select', { params: listParams } )
			.subscribe( ( data ) => {
					if ( this.debug )
					{
						console.log( 'getSelectList() => ', data );
					}
					const result = new Array<string>();
					result.push( '-' );
					data = data.sort( ( n1, n2 ) => {
						if (n1.value > n2.value )
						{
							return 1;
						}
						else if (n1.value < n2.value )
						{
							return -1;
						}
						return 0;
					});
					for ( const entry of data )
					{
						result.push( entry.label );
					}
					observer.next( result );
					observer.complete();
				},
				( error: HttpErrorResponse ) => {
					throw new GcBackendError( error.message, error.error );
				}
			);
		} ) );
	}
	
	public lockRecord( record: T ): void
	{
		this.recordData = record;
		this.httpClient.post<T>( this.api + '/lock', record ).subscribe(result => {
			if ( this.debug )
			{
				console.log( result );
			}
			this._locked = true;
		},
		(error: HttpErrorResponse) => {
			throw new GcBackendError( error.message, error.error );
		});
		return;
	}

	public unlockRecord( record: T ): void
	{
		if ( !this._locked )
		{
			return;
		}
		this.recordData = null;
		this.httpClient.post<T>( this.api + '/unlock', record ).subscribe(result => {
			if ( this.debug )
			{
				console.log( result );
			}
			this._locked = false;
		},
		(error: HttpErrorResponse) => {
			throw new GcBackendError( error.message, error.error );
		});
		return;
	}

	public addRecord( record: T ): void
	{
		if ( this.debug )
		{
			console.log( 'addRecord', record );
		}
		this.recordData = record;
		this.httpClient.post<T>( this.api + '/new', record ).subscribe(result => {
			if ( this.debug )
			{
				console.log( result );
			}
		},
		(error: HttpErrorResponse) => {
			throw new GcBackendError( error.message, error.error );
		});
		return;
	}

	public getRecordById( id )
	{
		if ( this.debug )
		{
			console.log( 'getRecordById', id );
		}
		return this.httpClient.get<T>( this.api + '/get/' + id );
	}

	public getRecord( record: T ): void
	{
		if ( this.debug )
		{
			console.log( 'getRecord', record );
		}
		this.recordData = record;
		this.httpClient.get<T>( this.api + '/get', record ).subscribe(result => {
			if ( this.debug )
			{
				console.log( result );
			}
		},
		(error: HttpErrorResponse) => {
			throw new GcBackendError( error.message, error.error );
		});
		return;
	}

	public updateRecord( record: T ): void
	{
		if ( this.debug )
		{
			console.log( 'updateRecord.orignal ', this.recordData );
			console.log( 'updateRecord.updated ', record );
		}
		for ( const key of Object.keys( record ) )
		{
			if ( this.debug )
			{
				console.log( 'update key ' + key + ' with value ', record[ key ] );
			}
			this.recordData[ key ] = record[ key ];
		}
		this.httpClient.post<T>( this.api + '/update', this.recordData ).subscribe( result => {
			if ( this.debug )
			{
				console.log ( result );
			}
		},
		(error: HttpErrorResponse) => {
			throw new GcBackendError( error.message, error.error );
		});
		return;
	}

	public genericPut( uri: string, params: any ): void
	{
		console.log( 'genericPut', uri, params );
		this.httpClient.put( this.api + uri, params ).subscribe( result => {
			if ( this.debug )
			{
				console.log ( result );
			}
		},
		(error: HttpErrorResponse) => {
			throw new GcBackendError( error.message, error.error );
		});
		return;
	}

	public genericGet( uri: string, params: any ): Observable<any>
	{
		if ( this.debug )
		{
			console.log( 'genericGet', uri, params );
		}
		return this.httpClient.get( this.api + uri, params );
	}

	public genericPost( uri: string, body: any | null, options: any | null ): Observable<any>
	{
		if ( this.debug )
		{
			console.log( 'genericPost', this.api + uri, body, options );
		}
		return this.httpClient.post( this.api + uri, body );
	}

	public downloadFile( filename: string, reqParams: any ): Observable<any>
	{
		const options = new HttpHeaders( { 'Content-Type': 'application/octet-stream' } );
		return this.httpClient.get( this.api + '/' + filename, { headers: options,
																	params: reqParams,
																	responseType: 'blob' } ).pipe (
			tap( data => {
				if ( this.debug )
				{
					console.log( 'You received data' );
				}
			},
			error => {
				console.error( error );
				throw new GcBackendError( error.message, error.error );
			} )
		);
	}
}

class PromiseService<T> 
{
	constructor( protected service: ObservableService<T> )
    {
        return;
	}
	
	public promiseGetSimpleList( value: string, label: string, initial: any = null, final: any = null ): Promise<any>
    {
		return new Promise((resolve, reject) => {
			this.service.getSelectListSimple( value, label, initial, final ).subscribe( data => {
				resolve( data );
			} );
		} );	
    }

	public promiseGetSelectList( value: string, label: string, initial: any = null, final: any = null ): Promise<GcSelectList[]>
    {
		return new Promise((resolve, reject) => {
			this.service.getSelectList( value, label, initial, final ).subscribe( data => {
				resolve( data );
			} );
		} );	
	}

	public promiseGetSelectionList( value: string, label: string, initial: any = null, final: any = null ): Promise<Array<string>>
    {
		return new Promise((resolve, reject) => {
			this.service.getSelectionList( value, label, initial, final ).subscribe( ( data: Array<string> ) => {
				resolve( data );
			} );
		} );	
	}


	public promisePut( uri: string, params: any ): Promise<any>
    {
		console.log( 'genericPut', uri, params );
		return new Promise( ( resolve, reject ) => {
			this.service.httpClient.put( this.service.api + uri, params ).subscribe( result => {
				resolve( result );
				if ( this.service.debug )
				{
					console.log ( result );
				}
			},
			(error: HttpErrorResponse) => {
				reject( error );
			});
		} );	
    }

    public promiseGet( uri: string, params: any ): Promise<any>
    {
		if ( this.service.debug )
		{
			console.log( 'promiseGet', uri, params );
		}
		return new Promise((resolve, reject) => {
			this.service.httpClient.get( this.service.api + uri, params ).subscribe( data => {
				resolve( data );
			} );
		} );	
    }

    public promisePost( uri: string, body: any | null, options: any | null ): Promise<any>
    {
		if ( this.service.debug )
		{
			console.log( 'promisePost', this.service.api + uri, body, options );
		}
		return new Promise((resolve, reject) => {
			this.service.httpClient.post( this.service.api + uri, body ).subscribe( data => {
				resolve( data );
			} );
		} );	
    }

}



@Injectable()
export class GcCrudServiceBase<T>
{
	public promise: PromiseService<T>;
	public observe: ObservableService<T>;

    constructor( protected httpClient: HttpClient, api: string )
    {
		this.observe = new ObservableService<T>( httpClient, api )
		this.promise = new PromiseService<T>( this.observe );
        return;
    }

	public get uri(): string
    {
      return ( this.observe.api );
    }

	/** Downwards compatebillity */
	/** CRUD METHODS */
	public getPage( page: number, 
					size: number, 
					sort_direction: string,
					sort_column: string, 
					filterRecord: GcFilterRecord ): Observable<GcPagingData> 
	{
		return ( this.observe.getPage( page, size, sort_direction, sort_column, filterRecord ) );
	}

	public deleteRecord( record_id: number ): void
	{
		this.observe.deleteRecord( record_id );
        return;
	}

    public list( _backend_filter: any ): Observable<T[]>
    {
		return ( this.observe.list( _backend_filter ) );
    }

    public getSelectListSimple( value: string, label: string, initial: any = null, final: any = null ): Observable<GcSelectList[]>
    {
		return ( this.observe.getSelectListSimple( value, label, initial, final ) );
    }

    public getSelectList( value: string, label: string, initial: any = null, final: any = null ): Observable<GcSelectList[]>
    {
		return ( this.observe.getSelectList( value, label, initial, final ) );
    }

    public getSelectionList( value: string, label: string, initial: any = null, final: any = null ): Observable<Array<string>>
    {
		return ( this.observe.getSelectionList( value, label, initial, final ) );
	}
	
    public lockRecord( record: T ): void
    {
		this.observe.lockRecord( record ); 
		return;
    }

    public unlockRecord( record: T ): void
    {
		this.observe.unlockRecord( record ); 
        return;
    }

    public addRecord( record: T ): void
    {
		this.observe.addRecord( record ); 
		return;
    }

    public getRecordById( id ): Observable<T>
    {
		return ( this.observe.getRecordById( id ) );
    }

    public getRecord( record: T ): void
    {
		this.observe.getRecord( record ); 
		return;
    }

    public updateRecord( record: T ): void
    {
		this.observe.updateRecord( record ); 
		return;
    }

    public genericPut( uri: string, params: any ): void
    {
		this.observe.genericPut( uri, params ); 
		return;
    }

    public genericGet( uri: string, params: any ): Observable<any>
    {
		return ( this.observe.genericGet( uri, params ) );   
    }

    public genericPost( uri: string, body: any | null, options: any | null ): Observable<any>
    {
		return ( this.observe.genericPost( uri, body, options ) );   
    }

    public downloadFile( filename: string, reqParams: any ): Observable<any>
    {
		return ( this.observe.downloadFile( filename, reqParams ) );   
	}
}
