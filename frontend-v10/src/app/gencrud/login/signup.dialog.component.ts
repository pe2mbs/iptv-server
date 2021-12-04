import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GcSignupData } from '../auth/model';


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'gc-signup',
	templateUrl: 'signup.dialog.component.html',
  styles: [ '.form-field { width: 100%; }',
			'.login-form { height: 570px; }',
		'.mat-dialog-content{ height: 610px!important; min-height: 610px!important;}' ]
})
export class GcSignupDialogComponent
{
	public signupForm: FormGroup;
	public showPw: boolean = false;
	
	constructor( public dialogRef: MatDialogRef<GcSignupDialogComponent>
			   , @Inject( MAT_DIALOG_DATA ) public data: any
			   , private fb: FormBuilder )
	{
		dialogRef.disableClose = true;
		this.signupForm = this.fb.group( {
			userid : new FormControl(
				'',
				[Validators.required, Validators.minLength( 7 ) ]
			),
			password : new FormControl(
				'',
				[Validators.required, Validators.minLength( 6 ) ]
			),
			email : new FormControl(
				'',
				[Validators.required, Validators.email ]
			),
			firstname : new FormControl(
				'',
				[Validators.required, Validators.minLength( 2 ) ]
			),
			middlename : new FormControl(
				'',
			),
			lastname : new FormControl(
				'',
				[Validators.required, Validators.minLength( 2 ) ]
			),
		} );
		return;
	}
	
	get userid() 
	{
		return this.signupForm.get( 'userid' );
	}

	get password() 
	{
		return this.signupForm.get( 'password' );
	}

	get email() 
	{
		return this.signupForm.get( 'email' );
	}

	get firstname() 
	{
		return this.signupForm.get( 'firstname' );
	}
	
	get middlename() 
	{
		return this.signupForm.get( 'middlename' );
	}

	get lastname() 
	{
		return this.signupForm.get( 'lastname' );
	}

	public onSignupClick(): void
	{
		// Here we need to send the information to the server 
		// When ever the data matches but the password failed
		// The server application sends a e-mail to the user 
		// with a new password, which he/she must change on first 
		// login.
		const signupData: GcSignupData = {
			username: this.userid.value,
			password: this.password.value,
			email: this.email.value,
			firstname: this.firstname.value,
			middlename: this.middlename.value,
			lastname: this.lastname.value
		};
		this.dialogRef.close( signupData );
		return;
	}

	public onCancelClick(): void 
	{
		this.dialogRef.close( null );
		return;
	}
}

