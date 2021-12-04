import { MatDialog } from '@angular/material/dialog';
import { GcCrudServiceBase } from './crud.service.base';
import { GcProfileService } from '../profile/profile.service';

export interface TableButton
{
	label: string;
	icon: string;
	action: any;
}

export interface TableColumn2
{
	columnDef: string;
	header: string;
	display: boolean;
	cell: any;
	width?: string;
	filter?: boolean;
	sort?: boolean;
	buttons?: TableButton[];
	dataService?: any;
	resolveList?: any;
}

export interface GcConditionItem
{
	value: string;
	label: string;
	param: number;
}

export interface GcFilterColumnReq
{
	column: string;
	value: string[];
	operator: string;
}


export interface GcCrudPageInfo
{
	pageIndex: number;
	pageSize: number;
	pageSizeOptions: number[];
	filters: GcFilterColumnReq[];
}

export interface GcPagingData
{
	pageIndex: number;
	pageSize: number;
	recordCount: number;
	records: any[];
}

export interface GcSortingRequest
{
	column: string;
	direction?: string; 
}

export interface GcPagingRequest
{
	pageIndex: number;
	pageSize: number;
	sorting?: GcSortingRequest;
	filters?: GcFilterColumnReq[];
}

export interface GcBackEndInfo
{
    code: number;
    name: string;
    message: string;
    url: string;
    traceback: any;
    request: any;
}

export interface GcFilterColumn
{
    column: string;
}

export interface GcBackendColumnSort
{
    column: string;
}

export interface GcFilteredListReq
{
    page: number;
    pageSize: number;
    columns?: GcFilterColumn[];
    columnSort?: GcBackendColumnSort;
}

export interface GcFilteredList<T>
{
    page: number;
    pageSize: number;
    recordCount: number;
    records: T;
}

export interface GcSelectList
{
    value: any;
    label: string;
}

export interface GcTableFilter
{
	id: string;
	value: any;
}

export interface TableDefintion<T>
{
	name: string;
	helpTopic?: string;
	defaultSortField: string;
	defaultSortDirection: string;
	sortDisableClear: boolean;
	dataService?: GcCrudServiceBase<T>;
	resolveList?: any;
	profileService?: GcProfileService;
	toggleUpdate?: boolean;
	self?: any;
	core?: any;
	rowDoubleClick: any;
	dialog?: MatDialog;
	columns: TableColumn2[];
	headerButtons?: TableButton[];
	footerButtons?: TableButton[];
}
