import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { EmailTemplate, EmailTemplateType } from '../models';

export function getTabSettings(
  selectedTemplateGetter: () => EmailTemplate | undefined,
  typeGetter: () => EmailTemplateType
): TabsSettings {
    const templateNamesWithPDF = [
        'EnquiryCustomerEMail', 'EnquiryAdminEMail', 'ReservationCustomerEMail',
        'ReservationAdminEMail', 'BookingCustomerEMail', 'BookingAdminEMail',
        'RESCustoEmailSARA', 'BOCustoEmailSARA'
    ];

    return  {
      buttons: [
        {
          id: 'email',
          label: 'BackEnd_WikiLanguage.TA_EMailContent'
        },
        {
          id: 'pdf',
          label: 'BackEnd_WikiLanguage.TA_PDFTAB',
          get disabled() {
              const template = selectedTemplateGetter();

              return template ? !templateNamesWithPDF.includes(template.name) : false;
          }
        },
        {
          id: 'images',
          label: 'BackEnd_WikiLanguage.EAT_EntityImages',
          get disabled() {
              return typeGetter() === EmailTemplateType.ADMIN;
          }
        },
        {
          id: 'attachments',
          label: 'BackEnd_WikiLanguage.TA_Attachments',
          get disabled() {
              return typeGetter() === EmailTemplateType.ADMIN;
          }
        }
      ],
      buttonClasses: ['nav-link']
    };
}