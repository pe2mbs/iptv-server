import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { GcAuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorDialogService } from '../error-dialog/errordialog.service';


@Injectable({
  	providedIn: 'root'
})
export class GcTokenInterceptorService implements HttpInterceptor 
{
	constructor( private authService: GcAuthService,
				 public errorDialogService: ErrorDialogService ) 
	{ 
		return;
	}

	intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>>
  	{
		let newHeaders = req.headers.set( 'Content-Type', 
		 								  'application/json' )
									.set( 'Accept', 
									      'application/json' );
		if ( this.authService.isLoggedIn() ) 
		{
			newHeaders = newHeaders.set( 'Authorization', 
										 'JWT ' + this.authService.token );
							 
		} 
		return next.handle( req.clone( { headers: newHeaders } ) ).pipe(
            map((event: HttpEvent<any>) => {
				if ( event instanceof HttpResponse ) 
				{
                    // console.log('event--->>>', event);
                }
                return event;
			} ),
			catchError( ( error: HttpErrorResponse ) => {
				let data = {};
				data = {
					reason: error && error.error && error.error.reason ? error.error.reason : '',
					status: error.status
				};
				// console.log( "error >> ", data );
				if ( error.status === 401 )
				{
					console.log( "Handled by higher level application" );
				}
				else if ( error.status >= 400 && error.status <= 499 )
				{
					// Backend error that some thing is not allowed
					this.errorDialogService.openDialog( data );
				}
				else if ( error.status >= 500 && error.status <= 599 )
				{
					// Backend error that some thing is not allowed
					this.errorDialogService.openDialogBackendError( data );
				}
				else
				{
					this.errorDialogService.openDialogFrontendError( error );
				}
                return throwError( error );
            } )
		);
  	}
}
