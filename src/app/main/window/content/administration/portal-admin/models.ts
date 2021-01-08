import { Trigger } from '@/app/main/models';

export interface RawPortalAdmin {
    p_id: string;
    p_name: string;
    p_accountNo: string;
    p_serialNo: string;
    p_active: string;
    p_ip: string;
    p_cssFile: string;
    p_ciName: string;
    p_multiple: string;
    p_showInWizard: string;
}

export interface PortalAdmin {
    id: number;
    name: string;
    accountNo: string;
    serialNo: string;
    active: boolean;
    ip: string;
    cssFile: string;
    ciName: string;
    multiple: boolean;
    showInWizard: boolean;
}

export type RawPortalAdminBody = Partial<Pick<RawPortalAdmin, 'p_id'>> & Omit<RawPortalAdmin, 'p_id'>;
export type PortalAdminBody = Omit<PortalAdmin, 'id'>;

export interface RawPortalAdminCustomer {
    pc_id: string;
    pc_comment: null | string;
    pc_portal_id: string;
    pc_customer_id: string;
    pc_remoteId: null | string;
    pc_active: string;
    c_id: string;
    c_name: string;
    c_dbName: string;
}

export interface PortalAdminCustomer {
    id: number;
    comment: null | string;
    portalId: number;
    customerId: number;
    remoteId: null | string;
    active: boolean;
    name: string;
    dbName: string;
}

export type PortalAdminCustomerSearched = Pick<PortalAdminCustomer, 'customerId' | 'dbName' | 'name'>;

export interface RawPortalAdminCategoryPackage {
    psoc_portal_id: null | string;
    psoc_specialOfferCategory_id: string;
    psoc_image: string | null;
    psoc_active: Trigger;
}

export interface PortalAdminCategoryPackage {
    portalId: null | number;
    specialOfferCategoryId: number;
    image: string | null;
    active: boolean;
}

export interface PortalAdminCategory {
    id: number;
    identifier: string;
}

export interface RawPortalAdminCategoryTranslation {
    soc_id: string;
    soc_ident: string;
    socl_specialOfferCategory_id: string;
    socl_locale_id: string;
    socl_name: string;
}

export interface PortalAdminCategoryTranslation {
    localeId: string;
    name: string;
}
