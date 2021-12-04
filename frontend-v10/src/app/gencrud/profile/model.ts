export interface Dictionary 
{
    [key: string]: any;
}

export interface ProfileInterface
{
	user: string;
	role: number;
	roleString: string;
	fullname: string;
	theme: string;
	locale: string;
	pageSize: number;
	profilePage?: string;
	profileParameters?: string;
	objects: Dictionary;
}
