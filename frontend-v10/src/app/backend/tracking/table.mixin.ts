import { TrackingDataService } from './service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TrackingRecord } from 'src/app/modules/demo/model';
import { GcProfileService } from 'src/app/gencrud/profile/profile.service';
import { TrackingRestoreDialogComponent } from './restore.dialog.component';
import { MessageDialog } from '../../gencrud/message-dialog/message.dialog.component';


export class TrackingBaseComponent
{
    constructor( protected dataService: TrackingDataService
               , protected profileService: GcProfileService
               , protected dialog: MatDialog
               , public router: Router )
    {
        return;
    }

	getItem( record: TrackingRecord ): Promise<TrackingRecord[]>
	{ 
		return new Promise((resolve, reject) => {
			this.dataService.genericPost( '/retrieve', record, {} ).subscribe( data => {
				resolve( data );
			} );
		} );	 
	} 

	private doRollback( row: TrackingRecord )
	{
		this.dataService.genericPost( '/rollback', row, {} ).subscribe( rollback => {
			console.log( 'Rolback result: ', rollback );
			if ( !rollback.ok )
			{
				MessageDialog( this.dialog, { 
					message: rollback.message,
					caption: 'Error restore record(s)'
				} );
			}
		} );
	}

    public restoreRecord( idx: number, row: TrackingRecord )
    {
		console.log( `restoreRecord( ${idx}, `, row, ' )' )
		const dialogRef = this.dialog.open( TrackingRestoreDialogComponent, {
			width: '80%',
			data: this.getItem( row )
		});  
		dialogRef.afterClosed().subscribe( result => {
			if ( result )
			{
				this.doRollback( row );
			}
		} );
        return;
    }
}
