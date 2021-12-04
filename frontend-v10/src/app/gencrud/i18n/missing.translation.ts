import { MissingTranslationHandlerParams, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';


export class GcMissingTranslationHandler implements MissingTranslationHandler 
{
	constructor( protected backendService: HttpClient )
	{
		return;
	}

	handle( params: MissingTranslationHandlerParams ) 
	{
		this.backendService.post<any>( '/api/languages/i18n/missing', {
			text: params.key,
			language: params.translateService.store.currentLang || params.translateService.store.defaultLang
		} ).subscribe( result => {} );
        return ( params.key );
    }
}
