import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { isNullOrUndefined } from 'util';
import { GcSignupData, GcAuthResponse } from './model';


@Injectable({
	providedIn: 'root',
})
export class GcAuthService 
{
	public changeEvent: EventEmitter<GcAuthService> = new EventEmitter<GcAuthService>(); 
	private jwtHelper = new JwtHelperService();
  	currentUser: any; 

	constructor( private http: HttpClient ) 
	{
		if ( this.isLoggedIn() )
		{
			this.currentUser = this.jwtHelper.decodeToken( this.token );
		}    
		return;
  	}

	public login( credentials ): Observable<boolean>
	{
		return ( this.http.post<GcAuthResponse>( '/api/user/authenticate', JSON.stringify( credentials ) ).pipe( 
			map( response => {
				if ( response && response.result ) 
				{
					localStorage.setItem( 'token', response.token );
					this.currentUser = this.jwtHelper.decodeToken( response.token );
					this.changeEvent.emit( this );
					return ( true ); 
				}
				else 
				{
					return ( false ); 
				}
			} ) 
		) );
	}
	  
	public signup( data: GcSignupData )
	{
		return ( this.http.post<GcAuthResponse>( '/api/user/signup', JSON.stringify( data ) ).pipe( 
			map( response => {
				return ( response && response.result ); 
			} )  
		) );
	}

	public logout(): void
	{
		this.http.post<GcAuthResponse>( '/api/user/logout', { U_NAME: this.currentUser.userName } ).subscribe( response => {
			return ( response && response.result ); 
		} );  
    	localStorage.removeItem( 'token' );
		this.currentUser = null;
		this.changeEvent.emit( this );
		return;
  	}

	public isLoggedIn(): boolean
	{ 
    	const token = this.token;
		if ( !token ) 
		{
      		return ( false );
		}
		const result = this.jwtHelper.isTokenExpired( token );
		return ( !result );
	}

	get userName(): string
	{
		if ( isNullOrUndefined( this.currentUser ) )
		{
			return ( '' );
		}
		return ( this.currentUser.identity );
	}

	get token() 
	{
		return ( localStorage.getItem( 'token' ) );
	}
}
