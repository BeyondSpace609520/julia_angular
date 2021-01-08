export interface LogBackendInit {
  be_browser: string;
  be_dbName: string;
  be_eventDate: '';
  be_hotelName: string;
  be_id: 0;
  be_ip: '';
  be_isMobile: 'true' | 'false';
  be_longDesc: string;
  be_operatingSystem: string;
  be_screenSize: string;
  be_shortDesc: 'INIT';
  eventType: 'BackEnd';
}

export interface LogBackendLogout {
  be_dbName: '';
  be_eventDate: '';
  be_hotelName: '';
  be_id: number;
  be_ip: '';
  be_longDesc: '';
  be_shortDesc: 'LogOut';
  eventType: 'BackEnd';
}
