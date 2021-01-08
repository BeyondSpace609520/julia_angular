import { PictureEntity } from '../../../shared/image-selector/models';
import { RawWebsitePages, RawWebsitePicture, WebsitePages } from './models';

export function reduceWebsitePages(p: RawWebsitePages): WebsitePages {
    return {
        id: +p.ctl_id,
        welcomePage: {
            heading: p.ctl_welcomePageHeading,
            text: p.ctl_welcomePageText
        },
        imprintPage: {
            heading: p.ctl_imprintHeading,
            text: p.ctl_imprintText
        }
    };
}

export function reduceWebsitePicture(p: RawWebsitePicture): PictureEntity {
    return {
        id: +p.ci_id,
        entityId: +p.cit_id,
        path: p.ci_picPath,
        sortOrder: p.ci_sortOrder ? +p.ci_sortOrder : 0,
        tag: p.ci_tag
    };
}
