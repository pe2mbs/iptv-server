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
import os
import json
import copy
import yaml
import logging
import traceback
from sqlalchemy import desc
import importlib
from flask import Blueprint, jsonify
import webapp2.api as API
from backend.models import *

__version__     = '0.0.0'
__date__        = '1970-01-01'
__copyright__   = '(c) Copyright 2018-2020, all rights reserved, GPL2 only'
__author__      = 'Marc Bertens-Nguyen'

applicApi = Blueprint( 'applicApi', __name__ )
logger = logging.getLogger()


def discoverModules():
    modules = []
    currentFolder = os.path.dirname( __file__ )
    _, rootPackage = os.path.split( currentFolder )
    for package in os.listdir( currentFolder ):
        packageFolder = os.path.join( currentFolder, package )
        if os.path.isdir( packageFolder ) and os.path.isfile( os.path.join( packageFolder, '__init__.py' ) ):
            module = importlib.import_module( ".".join( [ rootPackage, package ] ) )
            logger.info( "Loading module: {}".format( module.__name__ ) )
            modules.append( module )

    return modules


API.listModules = discoverModules()

def verifyMenuStruct( menu ):
    """Internal function to verify the menu structure, special for the function addMenu()

    :param menu:    menu struct
    :return:        None
    """
    if 'caption' not in menu:
        raise Exception( "Menu has no caption!: {} ".format( json.dumps( menu ) ) )

    if 'route' not in menu and 'children' not in menu and 'child' not in menu:
        raise Exception( "Menu has no route, children or child!: {} ".format( json.dumps( menu ) ) )

    if 'child' in menu:
        verifyMenuStruct( menu.get( 'child', [] ) )

    elif 'children' in menu:
        for child in menu.get( 'children', [] ):
            verifyMenuStruct( child )

    elif 'menu' in menu:
        for child in menu.get( 'menu', [] ):
            verifyMenuStruct( child )

    return


def _registerMenu( root_menu, menu, before = None, after = None ):
    if before is None:
        before = menu.get( 'before', None )

    if after is None:
        after = menu.get( 'after', None )

    if isinstance( root_menu, dict ):
        root_menu = root_menu[ 'children' ]

    if before is None and after is None:
        # Just add it at the back
        root_menu.append( menu )
        return

    for idx, item in enumerate( root_menu ):
        if before is not None and item[ 'caption' ] == before:
            # Found it
            root_menu.insert( idx, menu )
            return

        elif after is not None and item[ 'caption' ] == after:
            # Found it
            root_menu.insert( idx + 1, menu )
            return

    if before is not None:
        raise Exception( "Menu item '{}' not found".format( before ) )

    raise Exception( "Menu item '{}' not found".format( after ) )


def registerMenu( menu, before = None, after = None ):
    verifyMenuStruct( menu )
    _registerMenu( API.menuItems, menu, before, after )
    return


def registerSubMenu( menu, *args, before = None, after = None ):
    verifyMenuStruct( menu )
    subMenu = API.menuItems
    found = False
    for arg in args:
        found = False
        for idx, item in enumerate( API.menuItems ):
            if item[ 'caption' ] == arg:
                subMenu = item
                found = True
                break

    if not found:
        if before is not None:
            raise Exception( "Menu item '{}' not found".format( args ) )

        raise Exception( "Menu item '{}' not found".format( args ) )

    _registerMenu( subMenu, menu, before, after )
    return


def registerApi( app, cors ):
    logger = app.logger
    with open( os.path.join( os.path.dirname( __file__ ),'menu.yaml' ),'r' ) as stream:
        API.menuItems = yaml.load( stream,Loader = yaml.Loader )

    releaseFile = os.path.join( os.path.dirname( __file__ ),'release.yaml' )
    if os.path.isfile( releaseFile ):
        with open( releaseFile,'r' ) as stream:
            API.applicInfo = yaml.load( stream,Loader = yaml.Loader )

    setattr( app,'registerMenu',registerMenu )
    setattr( app,'registerSubMenu',registerSubMenu )
    for module in API.listModules:
        app.logger.debug( 'registering module {0}'.format( module ) )
        module.registerApi( app, cors )
        # if hasattr( module, 'menuItem' ):
        #     registerSubMenu( module.menuItem )

    if app.config.get( 'ALLOW_CORS_ORIGIN',False ):
        app.logger.info( 'Allowing CORS' )
        if app.config.get( 'ALLOW_CORS_ORIGIN',False ):
            origins = app.config.get( 'CORS_ORIGIN_WHITELIST','*' )
            cors.init_app( 'applicApi',origins = origins )

    logger.info( 'Register Menu route' )
    app.register_blueprint( applicApi )
    # This is temp. hook to load plugins
    for plugin in API.plugins:
        try:
            app.logger.debug( 'registering plugin {0}'.format( plugin ) )
            plugin.registerApi( app,cors )

        except Exception as exc:
            app.logger.exception( "Exception during puging registering" )

    return


def registerExtensions():
    API.app.logger.info( 'Register extensions' )
    for module in API.listModules:
        if hasattr( module, 'registerExtensions' ):
            module.registerExtensions()

    return


def registerShellContext():
    API.app.logger.info( 'Register shell context' )
    for module in API.listModules:
        if hasattr( module, 'registerShellContext' ):
            module.registerShellContext()

    return


def registerCommands():
    API.app.logger.info( 'Register extra commands' )
    for module in API.listModules:
        if hasattr( module, 'registerCommands' ):
            module.registerCommands()

    return


def getMenu( role: int ):
    modules = API.db.session.query( RoleAccess, ModuleAccess ).\
                            join( ModuleAccess, ModuleAccess.MA_ID == RoleAccess.RA_MA_ID ).\
                            filter( RoleAccess.RA_R_ID == role ).\
                            order_by( desc( RoleAccess.RA_MA_ID ) ).all()
    def processMenu( source_menu ):
        menu = []
        for item in source_menu:
            route = item.get( 'route', None )
            API.logger.info( "Menu Item: {} => {}".format( item.get( 'caption' ), route ) )
            if route is None:   # Sub menu
                result = processMenu( item.get( 'children', [] ) )
                if len( result ) > 0:
                    tmp = copy.copy( item )
                    tmp[ 'children' ] = copy.copy( result )
                    menu.append( tmp )

            else:               # Menu item
                ending = route.rsplit( '/', 1 )[ -1 ]
                for module in modules:
                    module: RoleAccess
                    API.logger.info( "Route match {} == {}".format( ending, module.ModuleAccess.MA_MODULE ) )
                    if module.ModuleAccess.MA_MODULE == ending or module.ModuleAccess.MA_MODULE ==  '*' or ending == '':
                        menu.append( item )

        return menu

    if len( API.menuItems ) == 1 and 'children' in API.menuItems:
        return processMenu( API.menuItems.get( 'children', [] ) )

    return processMenu( API.menuItems )


@applicApi.route( "/api/menu", methods=[ 'GET' ] )
def getAppMenu():
    # return jsonify( API.menuItems )
    return jsonify( getMenu( 1 ) )  # Administrator


@applicApi.route( "/api/application/menu", methods=[ 'GET' ] )
def getUserMenu():
    # return jsonify( API.menuItems )
    return jsonify( getMenu( 1 ) )  # Administrator
