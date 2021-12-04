import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

const HTML_TEMPLATE = `<mat-toolbar color="primary">
<mat-toolbar-row fxLayout="row">
    <span fxFlex="5">
        <button mat-icon-button><mat-icon>menu</mat-icon></button>
    </span>
    <span fxFlex="30" class="logo">
        <a href="/#/"><img src="assets/logo-equensWorldline.png" alt="equensWorldline" size="40"></a>
    </span>
    <span fxFlex="50">{{ headerTitle }}</span>
    <span fxFlex="40">
        <div fxFlex fxLayout="row" fxLayoutAlign="flex-end">
            <app-help helpitem="signedout"></app-help>
        </div>
    </span>
</mat-toolbar-row>
</mat-toolbar>
<div class="main-form">
<router-outlet></router-outlet>
</div>
<gc-footer></gc-footer>`;


@Component({
  	selector: 'app-signedout',
	template: HTML_TEMPLATE,
    styles: [ ':host { display: flex; flex-direction: column; height: 100%; overflow: hidden!important; }',
              '.main-form { height: 100%; overflow: hidden!important; }' ]
})
export class GcSignedOutComponent 
{
    headerTitle: string = 'Application';
    headerLogo: string = 'logo.png';
    
	constructor() 
	{ 
        if ( environment.headerTitle !== undefined && environment.headerTitle != null )
		{
			this.headerTitle = environment.headerTitle;
		}
		if ( environment.headerLogo !== undefined && environment.headerLogo != null )
		{
			this.headerLogo = environment.headerLogo;
		}
		return;
	}
}
