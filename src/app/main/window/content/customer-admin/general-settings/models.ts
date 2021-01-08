import { Trigger } from '@/app/main/models';

export interface Characteristic {
    ch_id: number;
    ch_name: string;
    chl_value: string;
    used: Trigger;
}

export interface VisitReason {
    vr_id: number;
    vr_name: string;
    vrl_value: string;
    used: Trigger;
}

export interface Arrival {
    am_id: number;
    am_name: string;
    aml_value: string;
    used: Trigger;
}

export interface DocumentType {
    dt_id: number;
    dt_name: string;
    dtl_value: string;
    used: Trigger;
}

export interface GuestRating {
    c_grShowRatingInBookingEdit: Trigger;
    c_grUseNetworkRatings: Trigger;
    c_guestRatingActive: Trigger;
    rv_shareRatings: Trigger;
}

export interface BookingSource {
    cbs_adminName: string;
    cbs_customerChannel_id: string | null;
    cbs_description: string;
    cbs_id: string;
    cbs_isDefaultSource: string;
    cbs_show: Trigger;
    cbsl_value: string;
}
