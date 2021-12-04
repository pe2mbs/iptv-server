import { Component, ElementRef, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { GcTickerDataService, NewsItem } from './service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'gc-news-ticker',
    template: `<div class="news-ticker" *ngIf="news.length > 0">
    <div class="news-bar">
        <div class="ticker-wrap">
            <div #newsbar class="ticker">
                <span *ngFor="let news_item of news" class="ticker__item">
                    <span class="news_alert" *ngIf="news_item.N_ALERT">{{ news_item.N_PERIOD }} {{ news_item.N_MESSAGE + " " }}</span>
					<span class="news_normal" *ngIf="news_item.N_ALERT === false">
						{{ news_item.N_PERIOD }} {{ news_item.N_MESSAGE  + " " }}
					</span>
                </span>
            </div>
        </div>
    </div>
</div>`,
    styleUrls: [ './ticker.component.scss' ],
})
export class GcTickerComponent implements OnInit 
{
    @ViewChild( "newsbar", { static: false } ) ticker: ElementRef;
	public news: NewsItem[] = [];

	constructor( public dataService: GcTickerDataService ) 
    { 
        return;
    }

    ngOnInit() 
    {
		this.news = this.dataService.getNews();
		this.dataService.updateEvent.subscribe( news => {
			this.news = news;
			if ( this.ticker )
			{
				this.ticker.nativeElement.style.animationDuration = `60s`;
			}
		} );
        return;
	}
}
