import { Component, Input, Injectable, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

export interface BreadcrumbItem
{
	label: string;
	url: string;
}


@Injectable({
	providedIn: 'root'
})
export class GcBreadcrumbService 
{
	private activatedRoute: ActivatedRoute
	public routeItems: BreadcrumbItem[] = new Array<BreadcrumbItem>();

	constructor( public router: Router ) 
	{
		this.router.events.subscribe( event => {
            if ( event instanceof NavigationEnd && !isNullOrUndefined( this.activatedRoute ) ) 
            {
				this.routeItems = this.createBreadcrumbs( this.activatedRoute.root );
				// console.log( "GcBreadcrumbComponent:", this.routeItems );
			}
			// else
			// {
			// 	console.log( "GcBreadcrumbComponent.event:", event );
			// }
        } );
	}

	private createBreadcrumbs( route: ActivatedRoute, url: string = '#', 
							   breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[]
    {
		// console.log( "GcBreadcrumbComponent.createBreadcrumbs:", route );
        const children: ActivatedRoute[] = route.children;
        if ( children.length === 0 )
        {
            return ( breadcrumbs );
        }
        for (const child of children)
        {
            const routeURL: string = child.snapshot.url.map( segment => segment.path ).join( '/' );
            if (routeURL !== '')
            {
                url += `/${routeURL}`;
            }
            let label = child.snapshot.data[ GcBreadcrumbComponent.ROUTE_DATA_BREADCRUMB ];
			if ( !isNullOrUndefined( label ) )
			{
				label = child.snapshot.data.title;
			}
			if ( !isNullOrUndefined( label ) && label !== '' )
            {
                breadcrumbs.push( { label, url } );
            }
            return this.createBreadcrumbs(child, url, breadcrumbs);
        }
	}

	public setActivatedRoute( activatedRoute: ActivatedRoute )
	{
		this.activatedRoute = activatedRoute;
		this.routeItems = this.createBreadcrumbs( this.activatedRoute.root );
		return;
	}
}


@Component({
  	// tslint:disable-next-line:component-selector
  	selector: 'gc-breadcrumb',
	templateUrl: 'breadcrumb.component.html',
	styleUrls: [ 'breadcrumb.component.scss' ],
} )
export class GcBreadcrumbComponent implements OnInit
{
    static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
	@Input() home: string = '/';
	home_item: BreadcrumbItem = {
		label: 'home',	// This is the icon
		url: '/#/'
	};

    constructor( private service: GcBreadcrumbService, private activatedRoute: ActivatedRoute )
    {
        return;
    }

	public ngOnInit()
	{
		this.service.setActivatedRoute( this.activatedRoute );
	}

	public get routeItems(): BreadcrumbItem[]
	{
		return ( this.service.routeItems );
	}
	
	public itemClick( $event, item: BreadcrumbItem )
	{
		this.service.router.navigate( [ item ] );
		return;
	}
}
