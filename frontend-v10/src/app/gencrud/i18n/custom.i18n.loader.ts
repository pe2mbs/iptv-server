import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export class GcI18nLoader implements TranslateLoader 
{
	constructor( private http: HttpClient) 
	{
		return;
	}
	  
	public getTranslation( langCountry: string ): Observable<any> 
	{
    	// Condition satisfies upon page load. com.json is loaded.
   		return this.http.get( `/api/languages/i18n/${langCountry}` );
	}
}
