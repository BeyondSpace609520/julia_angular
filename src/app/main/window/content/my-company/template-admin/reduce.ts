import {
  EmailTemplate, EmailTemplateDetail, EmailTemplateImages, RawEmailTemplate, RawEmailTemplateDetail,
  RawEmailTemplateImages, RawTemplateAttachment, TemplateAttachment,
} from './models';

export function reduceEmailTemplate(t: RawEmailTemplate): EmailTemplate {
  return {
    id: +t.er_id,
    name: t.er_name,
    translation: t.erl_name
  };
}

export function reduceEmailTemplateDetail(
  template: RawEmailTemplateDetail,
  id: EmailTemplate['id'],
  localeId: number,
  seasonPeriodId: number
): EmailTemplateDetail {
  if ('status' in template) {
    return {
      id,
      subject: '',
      emailText: '',
      emailImage: '',
      headerText: '',
      footerText: '',
      localeId,
      seasonPeriodId,
      withoutCommitmentLabel: template.defaultWCL,
      notFound: true,
  };
  }

  return {
    id: +template.etl_emailReason_id,
    subject: template.etl_emailSubject,
    emailText: template.etl_emailText,
    emailImage: template.etl_emailImage001,
    headerText: template.etl_headerText,
    footerText: template.etl_footerText,
    localeId: +template.etl_locale_id,
    seasonPeriodId: +template.etl_seasonPeriod_id,
    withoutCommitmentLabel: template.etl_withoutCommitmentLabel
  };
}

export function reduceEmailTemplateImages(t: RawEmailTemplateImages): EmailTemplateImages {
  return {
    image: t.itl_Image575,
    headerImage: t.itl_headerImage ? t.itl_headerImage.replace('_', '_575xXXX') : null,
    footerImage: t.itl_footerImage ? t.itl_footerImage.replace('_', '_575x80') : null
  };
}

export function prepareEmailTemplateDetailBody(t: EmailTemplateDetail): RawEmailTemplateDetail {
  return {
    etl_emailImage001: t.emailImage,
    etl_emailReason_id: String(t.id),
    etl_emailSubject: t.subject,
    etl_emailText: t.emailText,
    etl_headerText: t.headerText,
    etl_footerText: t.footerText,
    etl_locale_id: String(t.localeId),
    etl_seasonPeriod_id: String(t.seasonPeriodId),
    etl_withoutCommitmentLabel: t.withoutCommitmentLabel
  };
}

export function reduceTemplateAttachment(raw: RawTemplateAttachment): TemplateAttachment {
  return {
    creationDate: new Date(raw.fi_creationDateUnformatted),
    filename: raw.filename,
    sizeInKB: +raw.sizeInKB
  };
}
