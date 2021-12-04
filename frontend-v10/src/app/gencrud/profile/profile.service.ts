import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GcAuthService } from '../auth/auth.service';
import { ProfileInterface } from './model';
import { ProfileInfo } from './profile.info';


@Injectable({
	providedIn: 'root',
})
export class GcProfileService extends ProfileInfo
{
	constructor( private _httpClient: HttpClient, 
				 protected authService: GcAuthService )
	{
		super();
		this.data.user = authService.userName;
        if ( authService.isLoggedIn() )
        {
            this.getProfile();
		}
		this.authService.changeEvent.subscribe( data => {
			if ( authService.isLoggedIn() )
        	{
				this.data.user = authService.userName;
            	this.getProfile();
			}
			else
			{
				this.data = null;
			}
		} );
		console.log( "ProfileService.constructor", this.data );
		return;
	}

	public isLoggedIn(): boolean
	{
		return ( this.authService.isLoggedIn() ); 
	}

	public logout(): void
	{
		this.authService.logout();
		return;
	}

	public getProfile(): void 
	{
		// pull from server
		this.restoreProfile();
		setInterval( () => { 
			this.storeProfile();
		}, 30000 );
		return;
	}

 	public restoreProfile(): void 
	{
		this._httpClient.get<any>( `/api/user/profile/${this.user}` ).subscribe( data => {
			
			this.data = data;
			console.log( "restoreProfile", this.data );
			this._dirty = false;
			this.changeEvent.emit( this );
		} );
		return;
	}

	public storeProfile(): void
	{
		if ( this._dirty && this.data != null )
		{
			console.log( "StoreProfile", this.data );
			this._httpClient.post<ProfileInterface>( '/api/user/profile', this.data ).subscribe( data => {
				console.log( "storeProfile() => ", data );
				this._dirty = false;
			} );
		}
		return;
	}
}
