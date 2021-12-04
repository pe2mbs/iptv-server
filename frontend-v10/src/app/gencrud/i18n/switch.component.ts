import { Input, Component } from '@angular/core';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'gc-lang-switch',
	template: `<button mat-menu-item class="language-menu-item">
	<img [src]="image" class="flag"><span class="language">{{ label }}</span>
	</button>`,
	styleUrls: [ './switch.component.scss' ]
})
export class GcLanguageSwitchComponent // implements OnInit
{
	@Input()	image: string;
	@Input()	label: string;

	constructor()
	{
		return;
	}
}
