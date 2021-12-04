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
#   gencrud: 2021-04-04 08:26:09 version 2.1.680 by user mbertens
*/
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenCrudModule } from 'src/app/gencrud/gencrud.module';
import { GcHttpInterceptor } from 'src/app/gencrud/http-interceptor';

import { ScreenLanguageTranslationsComponent } from './screen.component';

import { LanguageTranslationsTableComponent } from './table.component';
import { LanguageTranslationsDataService } from './service';
import { LanguageReferenceModule } from '../language_reference/module';
import { GcDefaultComponent } from 'src/app/gencrud/default.component';


// tslint:disable-next-line:variable-name
export const language_translatesRoute: Route = {
    path: '',
    component: GcDefaultComponent,
    children: [
        {
            path:           'language_translates',
            data:
            {
                breadcrumb: 'Language Translations',
                title:      'Language Translations'
            },
            children: [
                {
                    path: '',
                    component: LanguageTranslationsTableComponent,
                    data:
                    {
                        breadcrumb: 'Overview',
                        title:      ''
                    }
                },
                {
                    path: 'new',
                    component: ScreenLanguageTranslationsComponent,
                    data:
                    {
                        breadcrumb: 'New',
                        title:      'New'
                    }
                },
                {
                    path: 'edit',
                    component: ScreenLanguageTranslationsComponent,
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
*   creating entry point and providing the services for the language_translates screens and dialogs.
*
*   This don't clutter the app-module.ts, instead of at least 4 components that are added to the app-module.ts
*   it only adds this module and includes it in the import section.
*/
@NgModule( {
    declarations: [
        ScreenLanguageTranslationsComponent,
        LanguageTranslationsTableComponent
    ],
    entryComponents: [
    ],
    providers: [
        LanguageTranslationsDataService,
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
        LanguageReferenceModule,
        RouterModule.forChild( [ language_translatesRoute ] ),
        GenCrudModule
    ],
    exports: [
        ScreenLanguageTranslationsComponent,
        LanguageTranslationsTableComponent,
    ]
} )
export class LanguageTranslationsModule
{
    static forRoot(): ModuleWithProviders<LanguageTranslationsModule>
    {
        return {
            ngModule: LanguageTranslationsModule,
            providers: [
                LanguageTranslationsDataService,
            ]
        };
    }
    static forChild(): ModuleWithProviders<LanguageTranslationsModule>
    {
        return { ngModule: LanguageTranslationsModule };
    }
}

