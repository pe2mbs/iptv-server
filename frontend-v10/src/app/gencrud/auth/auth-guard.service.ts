import { GcAuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class GcAuthGuard implements CanActivate 
{
	constructor( protected router: Router, 
				 protected authService: GcAuthService ) 
	{
		console.log( 'GcAuthGuard.constructor()' );
		return;
	}
 
	canActivate() 
	{
		console.log( 'GcAuthGuard.canActivate()' );
		if ( this.authService.isLoggedIn() ) 
		{
			console.log( 'true' );
			return ( true );
		}
		console.log( 'false - login' );
    	this.router.navigate( [ '/login' ] );
    	return ( false );
  	}
}

