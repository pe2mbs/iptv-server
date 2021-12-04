import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Languages } from './model';
import { LanguagesDataService } from 'src/app/backend/languages/service';

class LanguageObject implements Languages
{
	public label;
	public code2;
	public language;
}


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'gc-lang-switcher',
	template: `<button mat-icon-button [matMenuTriggerFor]="language">
	<mat-icon>language</mat-icon> {{ selected.language }}
</button>
<mat-menu #language="matMenu">
	<gc-lang-switch *ngFor="let lang of languages;" 
					image="/assets/countries/{{ lang.code2 }}.png" 
					label="{{ lang.label }}"
					(click)="selectLanguage( lang )">
	</gc-lang-switch>
</mat-menu>` ,
	styleUrls: [ './switch.component.scss' ]
})
export class GcLanguageSwitcherComponent // implements OnInit
{
	public languages: Languages[] = [ 
		{ label: 'English', code2: "gb", language: 'EN' }, 
		{ label: 'Nederlands', code2: "nl", language: 'NL' }, 
	]; 
	public selected: Languages = null;

	constructor( public translate: TranslateService, private languageService: LanguagesDataService )
	{
		const langs: string[] = new Array<string>();
		this.languages.forEach( lang => {
			langs.push( lang.language );
		} );
		this.languageService.list( null ).subscribe( data => {
			const newlangs: string[] = new Array<string>();
			this.languages = new Array<Languages>();
			// tslint:disable-next-line:no-shadowed-variable
			data.forEach( element => {
				newlangs.push( element.LA_CODE2 );
				const lang: LanguageObject = new LanguageObject();
				lang.label = element.LA_LABEL;
				lang.code2 = element.LA_COUNTRY_CODE2.toLowerCase();
				lang.language = element.LA_CODE2.toUpperCase();
				this.languages.push( lang );
			});
			translate.addLangs( newlangs );
		} );
		this.selected = this.languages[ 0 ];
		translate.setDefaultLang( 'en' );
		return;
	}

	public selectLanguage( lang: Languages )
	{
		this.selected = lang;
		console.log( 'Language selected: ', this.selected );
		this.translate.use( this.selected.code2 );
		return;
	}
}
