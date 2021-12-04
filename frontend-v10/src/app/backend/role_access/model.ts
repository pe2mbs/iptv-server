/*
#
#   Python backend and Angular frontend code generation by gencrud
#   Copyright (C) 2018-2021 Marc Bertens-Nguyen m.bertens@pe2mbs.nl
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
export class RoleAccessRecord
{
    RA_ID: number;
    RA_R_ID: number;
    RA_MA_ID: number;
    RA_CREATE: boolean;
    RA_READ: boolean;
    RA_UPDATE: boolean;
    RA_DELETE: boolean;
    R_REMARK: string;
    RA_R_ID_FK: any;
    RA_MA_ID_FK: any;
    RA_CREATE_LABEL: string;
    RA_READ_LABEL: string;
    RA_UPDATE_LABEL: string;
    RA_DELETE_LABEL: string;

}

