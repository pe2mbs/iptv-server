export interface GcAuthResponse
{
	result: boolean;
	token?: string;
}

export interface GcSignupData
{
	username: string;
	password: string;
	email: string;
	firstname: string;
	middlename: string;
	lastname: string;
}

export interface GcCredentials 
{
    userid: string;
    password: string;
    keepsignedin: boolean;
}
