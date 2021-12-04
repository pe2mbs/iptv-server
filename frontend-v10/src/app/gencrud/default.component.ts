import { Component } from '@angular/core';


@Component({
  	// tslint:disable-next-line:component-selector
  	selector: 'gc-default',
      template: `<gc-header (onToggleSidebar)="doToggleSidebar( $event )"></gc-header>
<gc-news-ticker></gc-news-ticker>      
<mat-drawer-container>
	<mat-drawer mode="side" [opened]="sideBarOpen">
		<gc-nav-sidebar></gc-nav-sidebar>
	</mat-drawer>
	<mat-drawer-content>
		<router-outlet></router-outlet>
	</mat-drawer-content>
</mat-drawer-container>
<gc-footer></gc-footer>`,
  	styleUrls: [ './default.component.scss' ]
})
export class GcDefaultComponent 
{
	public sideBarOpen: boolean = true;

	constructor() 
	{ 
		return;
	}

	public doToggleSidebar( $event ): void
	{
		this.sideBarOpen = !this.sideBarOpen;
		return;
	}
}
