import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { GcProfileService } from './profile.service';


@Component({
  	// tslint:disable-next-line:component-selector
  	selector: 'gc-user-profile',
  	templateUrl: 'profile.component.html',
  	styles: [ '.user-info { padding: 10px; }' ]
})
export class GcUserProfileComponent 
{
	constructor( public profileService: GcProfileService, 
				 private cdRef: ChangeDetectorRef,
				 private router: Router ) 
	{ 
		this.profileService.changeEvent.subscribe( event => {
        	console.log("GcUserProfileComponent.event", event);
			this.cdRef.detectChanges();
		} );
		return;
	}

	public logout(): void
	{
		this.profileService.logout();
		this.router.navigate( ['/login' ] );
		return;
	}
}
