import {
    PortalAdmin, PortalAdminBody, PortalAdminCategoryPackage, PortalAdminCustomer, RawPortalAdmin,
    RawPortalAdminBody, RawPortalAdminCategoryPackage, RawPortalAdminCustomer
} from './models';

export function reducePortalAdmin(p: RawPortalAdmin): PortalAdmin {
    return {
        id: +p.p_id,
        accountNo: p.p_accountNo,
        active: p.p_active === 'on',
        name: p.p_name,
        ip: p.p_ip,
        ciName: p.p_ciName,
        cssFile: p.p_cssFile,
        multiple: p.p_multiple === 'on',
        serialNo: p.p_serialNo,
        showInWizard: p.p_showInWizard === 'on'
    };
}

export function prepareAdminPortalBody(p: PortalAdmin | PortalAdminBody): RawPortalAdminBody {
    return {
        p_id: 'id' in p ? String(p.id) : undefined,
        p_name: p.name,
        p_accountNo: p.accountNo,
        p_serialNo: p.serialNo,
        p_active: p.active ? 'on' : 'off',
        p_ip: p.ip,
        p_cssFile: p.cssFile,
        p_ciName: p.ciName,
        p_multiple: p.multiple ? 'on' : 'off',
        p_showInWizard: p.showInWizard ? 'on' : 'off',
    };
}

export function reducePortalAdminCustomer(c: RawPortalAdminCustomer): PortalAdminCustomer {
    return {
        id: +c.pc_id,
        name: c.c_name,
        active: c.pc_active === 'on',
        comment: c.pc_comment,
        customerId: +c.c_id,
        portalId: +c.pc_portal_id,
        remoteId: c.pc_remoteId,
        dbName: c.c_dbName
    };
}

export function reducePortalAdminCategory(c: RawPortalAdminCategoryPackage): PortalAdminCategoryPackage {
    return {
        portalId: c.psoc_portal_id ? +c.psoc_portal_id : null,
        active: c.psoc_active === 'on',
        image: c.psoc_image,
        specialOfferCategoryId: +c.psoc_specialOfferCategory_id
    };
}
