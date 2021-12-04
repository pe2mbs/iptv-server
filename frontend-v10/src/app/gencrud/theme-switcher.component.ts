import { Component, OnInit } from '@angular/core';
import { GcProfileService } from './profile/profile.service';
import { isNullOrUndefined } from 'util';

@Component({
  	// tslint:disable-next-line:component-selector
  	selector: 'gc-theme-switcher',
  	template: `<button mat-button [matMenuTriggerFor]="menu"><mat-icon>format_color_fill</mat-icon></button>
<mat-menu #menu="matMenu">
	<button mat-menu-item class="{theme.value}" type="button" *ngFor="let theme of themes" 
							(click)="selectTheme( theme.value )">
		{{ theme.label }}
	</button>
</mat-menu>`
})
export class GcThemeSwitcherComponent implements OnInit 
{
	public themes = [
		{ label: 'equensWorldline', value: 'equensworldline-theme' },
		{ label: 'Light', value: 'light-theme' },
		{ label: 'Dark', value: 'dark-theme' },
		{ label: 'Purple', value: 'purple-theme' },
	];
	public themeColor = 'light-theme';

	constructor( protected profileService: GcProfileService ) 
	{
		this.profileService.changeEvent.subscribe( data => {
			if ( isNullOrUndefined( data.theme ) )
			{
				this.selectTheme( this.themeColor );
				console.error( "theme value not available" );
				return;
			}
			else if ( !isNullOrUndefined( data.theme ) && this.themeColor !== data.theme )
			{
				console.log( `theme set to {data.theme}` );
				this.selectTheme( data.theme );
			}
			else
			{
				console.error( "theme default" );
				this.selectTheme( this.themeColor );
			}
		} );
		return;
	}

	public ngOnInit(): void 
	{
	    this.setDefaultTheme();
		return;
	}

	public setDefaultTheme(): void 
	{
		const body = document.getElementsByTagName( 'body' )[ 0 ];
		body.classList.add( this.themeColor );
		return;
	}

	public selectTheme( theme: string ): void
	{
		const body = document.getElementsByTagName( 'body' )[0];
		body.classList.remove( this.themeColor );
		this.themeColor = theme;
		body.classList.add( this.themeColor );
		this.profileService.theme = theme;
		return;
	}
}
