import { PortalCategory, PortalFeature, RawPortalCategory, RawPortalFeature, RawPortal, Portal, RawPortalBody } from './models';

export function reducePortalFeature(f: RawPortalFeature): PortalFeature {
    return {
        id: +f.fl_feature_id,
        name: f.fl_name,
        checked: f.isSelected === 'on'
    };
}

export function reducePortalCategory(f: RawPortalCategory): PortalCategory {
    return {
        id: +f.ccl_companyCategory_id,
        name: f.ccl_name,
        checked: f.isSelected === 'on'
    };
}

export function reducePortal(p: RawPortal): Portal {
    return {
        id: +p.p_id,
        stars: +p.p_classStars,
        starsSuperior: p.p_classStarsSuperior === 'on',
        edelweiss: +p.p_classEdelweiss,
        flowers: +p.p_classFlowers,
        images: [{
            url: p.p_pic1 || null,
            key: 'p_pic1'
        }, {
            url: p.p_pic2 || null,
            key: 'p_pic2'
        }],
        shortDesc: p.pl_shortDesc,
        welcomeText: p.pl_welcomeText,
        longDescSummer: p.pl_longDescSummer,
        longDescWinter: p.pl_longDescWinter
    };
}

export function preparePortalBody(p: Portal, features: PortalFeature[], categories: PortalCategory[]): RawPortalBody {
    return {
        l_id: String(p.id),
        features: features.filter(f => f.checked).map(f => String(f.id)),
        categories: categories.filter(f => f.checked).map(f => String(f.id)),
        p_classStars: p.stars,
        p_classStarsSuperior: p.starsSuperior ? 'on' : 'off',
        p_classEdelweiss: p.edelweiss,
        p_classFlowers: p.flowers,
        pl_longDescSummer: p.longDescSummer,
        pl_longDescWinter: p.longDescWinter,
        pl_shortDesc: p.shortDesc,
        pl_welcomeText: p.welcomeText
    };
}
