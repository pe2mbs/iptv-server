import { Component, OnInit } from '@angular/core';
import { GcThemeSwitcherComponent } from './gencrud/theme-switcher.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit 
{
	constructor( public themeSwitch: GcThemeSwitcherComponent )
	{
		return;
	}

	ngOnInit()
	{
		this.themeSwitch.setDefaultTheme();
		return;
	}
}
