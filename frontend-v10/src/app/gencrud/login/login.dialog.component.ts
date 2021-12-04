import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GcAuthService } from '../auth/auth.service';
import { GcSignupDialogComponent } from './signup.dialog.component';
import { GcSignupData, GcCredentials } from '../auth/model';


@Component({
  	// tslint:disable-next-line:component-selector
  	selector: 'gc-login-dialog',
  	templateUrl: 'login.dialog.component.html',
	styles: [ '.form-field { width: 100%; }',
			  '.login-form { height: 170px; }' ]
})
export class GcLoginDialogComponent
{
	public showPw: boolean = false;
    public keepSignedIn: boolean;
    public invalidLogin: boolean;
	public loginForm: FormGroup;
	
	constructor( public dialogRef: MatDialogRef<GcLoginDialogComponent>
			   , @Inject( MAT_DIALOG_DATA ) public data: any
			   , private fb: FormBuilder
			   , private authService: GcAuthService
			   , private signupDialog: MatDialog ) 
	{ 
		dialogRef.disableClose = true;
		this.loginForm = this.fb.group( {
			userid : new FormControl(
				'',
				[Validators.required, Validators.minLength( 7 ) ]
			),
			password : new FormControl(
				'',
				[Validators.required, Validators.minLength( 6 ) ]
			),
			keepSignedIn : new FormControl()
		} );
		return;
	}

	public onSignupClick(): void
	{
		const signupDialogRef = this.signupDialog.open( GcSignupDialogComponent, {  
			autoFocus: true,
			width: '400px',
			height: 'auto',
			data: null
		} );
		signupDialogRef.afterClosed().subscribe( (result: GcSignupData) => {
			this.authService.signup( result	).subscribe();
		} );
	}

	public onLogonClick(): void 
	{
		const credentials: GcCredentials = { 
			userid: this.loginForm.value.userid, 
			password: this.loginForm.value.password,
			keepsignedin: this.loginForm.value.keepSignedIn
		};
		this.authService.login( credentials ).subscribe( result => {
			if ( result ) 
			{
				this.dialogRef.close();
			} 
			else 
			{
				this.invalidLogin = true;
			}
		},
		err => {
			this.invalidLogin = true;
		} );
		return;
	}

	get userid() 
	{
		return this.loginForm.get( 'userid' );
	}

	get password() 
	{
		return this.loginForm.get( 'password' );
	}
}
