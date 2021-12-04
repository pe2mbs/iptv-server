export interface GcMenuItem
{
	caption: string;
	icon: string;
	id: string;
	route?: string;
	children?: GcMenuItem[];
}
