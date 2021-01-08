import { stringifyDate, parseDate } from '@/app/helpers/date';
import { RawMessageCenterMessage, MessageCenterMessage } from './models';

export function reduceMessageCenterMessage(m: RawMessageCenterMessage): MessageCenterMessage {
  
  return {
    
    id: +m.m_id,
    messageTypeId: +m.m_messageType_id,
    messageActionId: +m.m_messageAction_id,
    name: m.ma_name,
    data: +m.m_data,
    localeId: +m.m_locale_id,
    text: m.m_text,
    creationDate: parseDate(m.m_creationDate),
    readDate: parseDate(m.m_readDate),
    source: m.m_source,
    icon: m.bs_icon,
    fromDate: parseDate(m.eb_fromDate),
  };
}
