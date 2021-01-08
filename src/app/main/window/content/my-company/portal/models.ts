import { Trigger } from '@/app/main/models';

export interface RawPortalFeature {
    fl_feature_id: string;
    fl_locale_id: string;
    fl_name: string;
    pf_portal_id: string;
    pf_feature_id: string;
    isSelected: Trigger;
}

export interface PortalFeature {
    id: number;
    name: string;
    checked: boolean;
}

export interface RawPortalCategory {
    ccl_companyCategory_id: string;
    ccl_locale_id: string;
    ccl_name: string;
    pcc_portal_id: string;
    pcc_companyCategory_id: string;
    isSelected: Trigger;
}

export interface PortalCategory {
    id: number;
    name: string;
    checked: boolean;
}


export interface RawPortal {
    p_id: string;
    p_classStars: string;
    p_classEdelweiss: string;
    p_classFlowers: string;
    p_pic1: string;
    p_pic2: string;
    p_classStarsSuperior: Trigger;
    pl_portal_id: string;
    pl_locale_id: string;
    pl_shortDesc: string;
    pl_welcomeText: string;
    pl_longDescWinter: string;
    pl_longDescSummer: string;
}

export interface PortalImage {
    url: string | null;
    key: string;
}

export interface Portal {
    id: number;
    images: PortalImage[];
    stars: number;
    starsSuperior: boolean;
    edelweiss: number;
    flowers: number;
    shortDesc: string;
    welcomeText: string;
    longDescWinter: string;
    longDescSummer: string;
}

export interface RawPortalBody {
    l_id: string;
    features: string[];
    categories: string[];
    p_classStars: number;
    p_classStarsSuperior: Trigger;
    p_classEdelweiss: number;
    p_classFlowers: number;
    pl_shortDesc: string;
    pl_welcomeText: string;
    pl_longDescWinter: string;
    pl_longDescSummer: string;
}
