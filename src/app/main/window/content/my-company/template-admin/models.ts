export enum EmailTemplateType {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  ALL = 'all'
}

export interface RawEmailTemplate {
  er_id: string;
  er_name: string;
  erl_name: string;
}

export type RawEmailTemplateDetail = {
  etl_emailImage001: string;
  etl_emailReason_id: string;
  etl_emailSubject: string;
  etl_emailText: string;
  etl_footerText: string;
  etl_headerText: string;
  etl_locale_id: string;
  etl_seasonPeriod_id: string;
  etl_withoutCommitmentLabel: string;
} | {
  status: 'NOTFOUND';
  defaultWCL: string;
};

export interface RawEmailTemplateImages {
  itl_Image575: null | string;
  itl_emailReason_id: string;
  itl_footerImage: null | string;
  itl_headerImage: null | string;
  itl_locale_id: string;
  itl_seasonPeriod_id: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  translation: string;
}

export interface EmailTemplateDetail {
  emailImage: string;
  id: number;
  subject: string;
  emailText: string;
  headerText: string;
  footerText: string;
  localeId: number;
  seasonPeriodId: number;
  withoutCommitmentLabel: string;
  notFound?: boolean;
}

export interface EmailTemplateImages {
  image: null | string;
  footerImage: null | string;
  headerImage: null | string;
}

export interface RawTemplateAttachment {
  filename: string;
  sizeInKB: string;
  fi_creationDateUnformatted: string;
}

export interface TemplateAttachment {
  filename: string;
  sizeInKB: number;
  creationDate: Date;
}
