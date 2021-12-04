import os
from flask import Blueprint, request, jsonify
import webapp2.api as API
import traceback
from mako.template import Template

# @API.coreApi.route( '/api/help/<helpitem>', methods=[ 'GET' ] )
# def getHelp( helpitem ):
#     if '-' in helpitem:
#         helpmodule, helptopic = helpitem.split( '-', 1 )
#
#     else:
#         helpmodule = helptopic = helpitem
#
#     API.logger.info("Help information: module: '{}', topic: '{}'".format( helpmodule, helptopic ) )
#     helpPath = os.path.abspath( os.path.join( API.app.config.get( 'API_MODULE' ),
#                                               helpmodule,
#                                               "{}.md".format( helptopic ) ) )
#     if os.path.isfile( helpPath ):
#         try:
#             with open( helpPath, 'r' ) as stream:
#                 result = stream.read()
#
#         except FileNotFoundError:
#             result = "No help available"
#
#     else:
#         helpPath = os.path.abspath( API.app.config.get( 'HELP_PATH', 'help' ) )
#         try:
#             with open( os.path.join( helpPath, "{}.md".format( helpitem ) ), 'r' ) as stream:
#                 result = stream.read()
#
#         except FileNotFoundError:
#             result = "No help available"
#
#     return jsonify( result )

DEFAULT_NO_HELP = """# No help available
    
At this time there is no help available for this topic.

For more information, please contact :
* Marc Bertens-Nguyen
* Ernst Rijerse

"""
helpPaths = [ '.' ]

def includeFunc( filename ):
    global helpPaths
    try:
        for helpPath in helpPaths:
            searchFilename = os.path.abspath( os.path.join( helpPath, filename ) )
            if os.path.isfile( searchFilename ):
                API.app.logger.info( "Help include filename: {}".format( searchFilename ) )
                with open( searchFilename, 'r' ) as stream:
                    return stream.read()

        raise Exception( "Help file {} not found in {}".format( filename, helpPaths ) )

    except Exception as exc:
        API.logger.error( traceback.format_exc() )
        return str( exc )


def getHelpInfo( *args ):
    global helpPaths
    helpData = None
    rootHelpPath = os.path.abspath( os.path.join( '.', 'help' ) )

    API.app.logger.info( "Help arguments: {}".format( args ) )
    for helpItem in args:
        helpBareItem = helpItem
        if helpBareItem.endswith( '-table' ):
            helpBareItem = helpBareItem[ : -6 ]

        elif '/' in helpBareItem:
            helpBareItem, helpItem = helpBareItem.rsplit( '/', 1 )

        elif '\\' in helpBareItem:
            helpBareItem, helpItem = helpBareItem.rsplit( '\\', 1 )

        helpPaths = [ os.path.abspath( os.path.join( os.path.dirname( __file__ ), '..', helpBareItem ) ),
                      rootHelpPath ]
        for helpPath in helpPaths:
            helpfilename = os.path.join( helpPath, "{}.md".format( helpItem ) )
            API.app.logger.info( "Checking help file: '{}'".format( helpfilename ) )
            if os.path.isfile( helpfilename ):
                API.app.logger.info( "Loading help file: '{}'".format( helpfilename ) )
                with open( helpfilename,'r' ) as stream:
                    helpData = stream.read()

                break

        if helpData is not None:
            break

    if helpData is None:
        helpData = DEFAULT_NO_HELP

    helpData = helpData.replace( '#', '~#' )    # Make sure the Mako don't fuck-up our markdown
    helpData = Template( helpData ).render( include = includeFunc )
    return helpData.replace( '~#', '#' )        # Reverse the substitution


@API.coreApi.route( '/api/help', methods = [ 'POST' ] )
def getHelpInfoStandard():
    args = request.json
    text = request.data
    API.app.logger.info( "/api/help: {}\n{}".format( args, text ) )
    helpinfo = args.get( 'helpitem', args.get( 'fallback', 'no_help_available' ) )
    helpText = getHelpInfo( helpinfo, args.get( 'fallback', 'no_help_available' ), 'no_help_available' )
    return jsonify( help = helpinfo, text = helpText )


@API.coreApi.route( '/api/help/<helpinfo>', methods = [ 'GET' ] )
def getHelpInfoDetail( helpinfo ):
    helpText = getHelpInfo( helpinfo, 'no_help_available' )
    return jsonify( help = helpinfo, text = helpText )
