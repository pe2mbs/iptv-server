import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrackingRecord } from './model';



@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-restore-dialog-component',
    templateUrl: './restore.dialog.component.html',
    styleUrls: [ './restore.dialog.component.scss' ]
})
export class TrackingRestoreDialogComponent
{
	panelOpenState = false;
	actionRollback = [ '---', 'delete', 'change', 'insert' ] 
	restoreTable:TrackingRecord[] = [];
	constructor( public dialogRef: MatDialogRef<TrackingRestoreDialogComponent>,
				 @Inject( MAT_DIALOG_DATA ) public data: Promise<TrackingRecord[]> ) 
	{
		this.restoreTable = new Array<TrackingRecord>();
		data.then( ( result: TrackingRecord[] ) => {
			console.log( "Data catch", result );	
			result.forEach( element => {
				console.log( "Data element", element );	
				element.T_CONTENTS = JSON.parse( element.T_CONTENTS );
				this.restoreTable.push( element );
			} );
			const last = this.restoreTable.length-1
			if ( last > 0 && 
			 	 this.restoreTable[ 0 ].T_ACTION === 1 && 
				 this.restoreTable[ last ].T_ACTION === 3 )
			{
				this.restoreTable = new Array<TrackingRecord>();
			}
		} );
		return;
	}

	onNoClick(): void 
	{
		this.dialogRef.close( false );
		return;
	}
	
	onYesClick(): void 
	{
		this.dialogRef.close( true );
		return;
	}
}