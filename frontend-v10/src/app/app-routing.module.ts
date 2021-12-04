import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GcDefaultComponent } from './gencrud/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GcAuthGuard } from './gencrud/auth/auth-guard.service';
import { TableHttpExample } from './modules/demo/table-http-example';
import { CustDataTableComponent } from './gencrud/crud/cust.data.table.component';


const routes: Routes = [
	{ 	path: '',
		component: GcDefaultComponent,
		canActivate: [ GcAuthGuard ],
		children: [
			{
                path: '',
                data: 
                {
                    breadcrumb: 'Dashboard',
                },
				component: DashboardComponent
			},
			{
                path: 'demo',
                data: 
                {
                    breadcrumb: 'Demo',
                },
				component: TableHttpExample
			},
			{
                path: 'demo2',
                data: 
                {
                    breadcrumb: 'Demo-2',
                },
				component: CustDataTableComponent
			},
			
		]
	}
];

@NgModule({
  	imports: [ 
		RouterModule.forRoot( routes, {
	  		useHash: true,
	  		enableTracing: false
	  	} ) 
	],
  	exports: [ 
		RouterModule 
	]
})
export class AppRoutingModule 
{ 
	
}
