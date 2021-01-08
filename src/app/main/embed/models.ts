export interface EmbedContentSource {
    embed: {
        moduleId: string;
        selector: string;
    };
    visible?: boolean;
}


// tslint:disable-next-line: max-line-length
// example: {"m_id":"1067","m_messageType_id":"1","m_messageAction_id":"2","ma_name":"createChannelBooking","m_data":"1264","m_locale_id":"2","m_text":"Neue Buchung, Test test24 Test booking.com test24","m_creationDate":"2020-11-12 16:41:23","m_readDate":"","m_source":"booking.com","bs_icon":"bookingDotComIcon","eb_fromDate":"2020-11-13"}
export interface RawMessageCenterMessage {
  m_id: string;
  m_messageType_id: string;
  m_messageAction_id: string;
  ma_name: string;
  m_data: string;
  m_locale_id: string;
  m_text: string;
  m_creationDate: string;
  m_readDate: string;
  m_source: string;
  bs_icon: string;
  eb_fromDate: string;
}

export interface MessageCenterMessage {
  id: number;
  messageTypeId: number;
  messageActionId: number;
  name: string;
  data: number;
  localeId: number;
  text: string;
  creationDate: Date;
  readDate?: Date;
  source: string;
  icon: string;
  fromDate: Date;
}
