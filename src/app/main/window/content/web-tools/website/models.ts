export interface RawWebsitePages {
    ctl_id: string;
    ctl_locale_id: string;
    ctl_welcomePageHeading: string;
    ctl_welcomePageText: string;
    ctl_imprintHeading: string;
    ctl_imprintText: string;
}

export type WebsitePageSource = 'welcomePage' | 'imprintPage';
export interface WebsitePage {
    heading: string;
    text: string;
}

export type WebsitePages = {
    id: number;
} & { [key in WebsitePageSource]: WebsitePage };

export type WebsitePictureSource = 'summer' | 'winter' | 'logo';

export interface RawWebsitePicture {
    ci_id: string;
    ci_picPath: string;
    ci_tag: string;
    ci_sortOrder: string | null;
    ci_cmsImageType_id: string;
    cit_id: string;
    cit_name: WebsitePictureSource;
}
