import { GcAuthGuard } from './auth-guard.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GcAdminAuthGuard extends GcAuthGuard 
{
	canActivate() 
	{
		console.log( 'AdminAuthGuard.canActivate()' );
    	const isAuthenticated = super.canActivate();
		if ( !isAuthenticated )
		{
			console.log( 'false' );
      		return ( false );  
		}
		if ( this.authService.currentUser.admin )
		{
			console.log( 'true' );
      		return ( true ); 
		}
		console.log( 'false - no access' );
    	this.router.navigate( [ '/no-access' ] );
    	return false;
  	}
}
