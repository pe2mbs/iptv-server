import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType, CompactType, GridsterItemComponent, 
		 DisplayGrid, GridsterItemComponentInterface } from 'angular-gridster2';

@Component( {
	selector: 'app-trackby-item',
	template: `
	  <div class="button-holder">
		<div style="font-size: 30px">ID: {{id}}</div>
	  </div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
} )
export class TrackByItemComponent extends GridsterItemComponentInterface implements OnInit 
{
	@Input() id: string;
  
	ngOnInit(): void 
	{
	  	// tslint:disable-next-line:no-console
	  	console.info(`Init ${this.id}`);
	}
}


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit 
{
	options: GridsterConfig;
	dashboard: Array<GridsterItem>;
	itemToPush: GridsterItemComponentInterface;

	static itemChange( item, itemComponent ) 
	{
		console.log( 'itemChanged', item, itemComponent );
	}	   

	static itemResize( item, itemComponent ) 
	{
		console.log( 'itemResized', item, itemComponent );
	}

	constructor() 
	{ 
		return;
	}

	ngOnInit() 
	{
		this.options = {
			gridType: GridType.Fit,
			compactType: CompactType.None,
			displayGrid: DisplayGrid.Always,
			minCols: 1,
      		maxCols: 10,
      		minRows: 1,
			maxRows: 10,
			maxItemCols: 10,
      		minItemCols: 1,
      		maxItemRows: 10,
      		minItemRows: 1,
      		pushItems: true,
			draggable: 
			{
        		enabled: true
      		},
			resizable: 
			{
        		enabled: true
      		},
			itemChangeCallback: DashboardComponent.itemChange,
			itemResizeCallback: DashboardComponent.itemResize,
		};
	  
		this.dashboard = [
			{ cols: 5, rows: 4, y: 0, x: 0, initCallback: this.initItem.bind( this ) },
			{ cols: 5, rows: 1, y: 0, x: 2 },
			{ cols: 2, rows: 1, y: 0, x: 2 },
			{ cols: 1, rows: 1, y: 0, x: 2 },
			{ cols: 3, rows: 1, y: 0, x: 2 },
		];
		return;
  	}

	public initItem( item: GridsterItem, itemComponent: GridsterItemComponentInterface ): void
	{
		this.itemToPush = itemComponent;
	}

	public changedOptions(): void 
	{
		this.options.api.optionsChanged();
		return;
	}

	public removeItem( item ): void
	{
		this.dashboard.splice( this.dashboard.indexOf( item ), 1 );
		return;
	}

	public addItem(): void
	{
		// this.dashboard.push( {} );
		return;
	}
}
