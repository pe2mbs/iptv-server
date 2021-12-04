import { Dictionary, ProfileInterface } from './model';
import { isNullOrUndefined, isObject, isString } from 'util';
import { EventEmitter } from '@angular/core';

const defaultProfile: ProfileInterface =
{
	user: 'testing',
	role: 1,
	roleString: 'Administator',
	locale: 'nl_NL',
	pageSize: 10,
	fullname: 'Marc Bertens-Nguyen',
	theme: 'equensworldline-theme',
	objects: {}
};

function instanceOfProfileInterface( object: any ): boolean 
{
    return ( 'user' in object && 'fullname' in object );
}


export class ProfileInfo
{
	public changeEvent: EventEmitter<ProfileInfo> = new EventEmitter<ProfileInfo>(); 
	
	protected _dirty: boolean = false;
	protected data: Dictionary;
    constructor( data: any = null )
	{
		this.data = new Object();
		// tslint:disable-next-line:forin
		for ( const property in defaultProfile )
		{
			console.log( property + ': ' + defaultProfile[ property ] );
			this.data[ property ] = defaultProfile[ property ];
		}
		if ( !isNullOrUndefined( data ) )
        {
			if ( isObject( data ) )
			{
				if ( instanceOfProfileInterface( data ) )
				{
					this.data = data;
				}
			}
			else if ( isString( data ) )
			{
				if ( data.startsWith( '{' ) && data.endsWith( '}' ) )
            	{
					const tmpData = JSON.parse( data );
					if ( instanceOfProfileInterface( data ) )
					{
						this.data = tmpData;
					}
				}
            }
		}
		return;
	}

    public get user(): string
    {
		if ( isNullOrUndefined( this.data ) )
		{
			return ( 'guest' ); 
		}
        return ( this.data.user );
    }

	public get fullname(): string
    {
		if ( isNullOrUndefined( this.data ) )
		{
			return ( 'Guest' ); 
		}
        return ( this.data.fullname );
	}
	
	public get role(): number
	{
		if ( isNullOrUndefined( this.data ) )
		{
			return ( 0 ); 
		}
        return ( this.data.role );
	}
	
	public get roleString(): string
	{
		if ( isNullOrUndefined( this.data ) )
		{
			return ( '' ); 
		}
        return ( this.data.roleString );
    }

	public get theme(): string
    {
		if ( isNullOrUndefined( this.data ) )
		{
			return ( 'equensworldline-theme' ); 
		}
		return ( this.data.theme );
    }

	public set theme( value: string )
    {
		const changed = this.data.theme !== value;
		this.data.theme = value;
		this._dirty = true;
		if ( changed )
		{
			this.changeEvent.emit( this );
		}
		return;
	}
	
	public get pagesize(): number
	{
		if ( isNullOrUndefined( this.data ) )
		{
			return ( 10 ); 
		}
		return ( this.data.pageSize );
	}

	public get locale(): string
	{
		if ( isNullOrUndefined( this.data ) )
		{
			return ( 'en_GB' ); 
		}

		return ( this.data.locale );
	}

	public get profilePage(): string
	{
		if ( isNullOrUndefined( this.data ) )
		{
			return ( '#' ); 
		}
		return ( this.data.profilePage ); 
	}

	public get profileParameters(): any
	{
		if ( isNullOrUndefined( this.data ) )
		{
			return ( {} ); 
		}
		return ( this.data.profileParameters );
	}

    public get dirty(): boolean
    {
        return ( this._dirty );
    }

    public setParam( name: string, value: any ): void
    {
		this.data.objects[ name ] = value;
		this._dirty = true;
		console.log( 'setParam'. normalize, value, this._dirty );
		console.log( 'data', this.data );
        return;
    }

    public getParam( name: string, default_value: any ): any
    {
		if ( isNullOrUndefined( this.data.objects[ name ] ) )
		{
			this.data.objects[ name ] = default_value;
		}
		return ( this.data.objects[ name ]);
    }

    public getString( name: string, default_value: string = "" ): string
    {
        return ( this.getParam( name, default_value ) );
    }

    public setString( name: string, value: string ): void
    {
        this.setParam( name, value );
        return;
    }

    public getNumber( name: string, default_value: number = 0 ): number
    {
        return ( this.getParam( name, default_value ) );
    }

    public setNumber( name: string, value: number ): void
    {
        this.setParam( name, value );
        return;
	}
}
