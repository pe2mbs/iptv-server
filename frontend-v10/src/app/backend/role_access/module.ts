/*
#
#   Python backend and Angular frontend code generation by gencrud
#   Copyright (C) 2018-2020 Marc Bertens-Nguyen m.bertens@pe2mbs.nl
#
#   This library is free software; you can redistribute it and/or modify
#   it under the terms of the GNU Library General Public License GPL-2.0-only
#   as published by the Free Software Foundation.
#
#   This library is distributed in the hope that it will be useful, but
#   WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
#   Library General Public License for more details.
#
#   You should have received a copy of the GNU Library General Public
#   License GPL-2.0-only along with this library; if not, write to the
#   Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
#   Boston, MA 02110-1301 USA
#
#   gencrud: 2021-04-04 08:27:09 version 2.1.680 by user mbertens
*/
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenCrudModule } from 'src/app/gencrud/gencrud.module';
import { GcHttpInterceptor } from 'src/app/gencrud/http-interceptor';

import { ScreenRoleAccessComponent } from './screen.component';

import { RoleAccessTableComponent } from './table.component';
import { RoleAccessDataService } from './service';
import { GcDefaultComponent } from 'src/app/gencrud/default.component';


// tslint:disable-next-line:variable-name
export const role_accessRoute: Route = {
    path: '',
    component: GcDefaultComponent,
    children: [
        {
            path:           'role_access',
            data:
            {
                breadcrumb: 'Role Access',
                title:      'Role Access'
            },
            children: [
                {
                    path: '',
                    component: RoleAccessTableComponent,
                    data:
                    {
                        breadcrumb: 'Overview',
                        title:      ''
                    }
                },
                {
                    path: 'new',
                    component: ScreenRoleAccessComponent,
                    data:
                    {
                        breadcrumb: 'New',
                        title:      'New'
                    }
                },
                {
                    path: 'edit',
                    component: ScreenRoleAccessComponent,
                    data:
                    {
                        breadcrumb: 'Edit',
                        title:      'Edit'
                    }
                },
            ]
        }
    ]
};

/*
*   This NgModule is injected in the app-module.ts. This deals with declaring, importing,
*   creating entry point and providing the services for the role_access screens and dialogs.
*
*   This don't clutter the app-module.ts, instead of at least 4 components that are added to the app-module.ts
*   it only adds this module and includes it in the import section.
*/
@NgModule( {
    declarations: [
        ScreenRoleAccessComponent,
        RoleAccessTableComponent
    ],
    entryComponents: [
    ],
    providers: [
        RoleAccessDataService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GcHttpInterceptor,
            multi: true
        },
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild( [ role_accessRoute ] ),
        GenCrudModule
    ],
    exports: [
        ScreenRoleAccessComponent,
        RoleAccessTableComponent,
    ]
} )
export class RoleAccessModule
{
    static forRoot(): ModuleWithProviders<RoleAccessModule>
    {
        return {
            ngModule: RoleAccessModule,
            providers: [
                RoleAccessDataService,
            ]
        };
    }
    static forChild(): ModuleWithProviders<RoleAccessModule>
    {
        return { ngModule: RoleAccessModule };
    }
}

