import { Trigger } from '@/app/main/models';
import { RawFeature } from '../../../shared/room-features/models';

export interface RawApartmentPictureEntity {
    ep_entityGroup_id: string;
    ep_id: string;
    ep_picPath: string;
    ep_sortOrder: string;
}

export interface RoomListItem {
    id: number;
    sortOrder: string;
    uniqueNo: string;
    isSeparator: boolean;
}

export interface RoomType {
    id: number;
    name: string;
}

export interface ApartmentRoom {
    no: string;
    categoryId: number;
    notBookable: boolean;
}

export interface RawRoomsValidationResponse {
    currentRooms?: number;
    maxRooms?: string;
    msg: 'overLicense' | 'notOverLicense';
    roomsToAdd?: number;
    roomstats?: {
        e_uniqueNo: string;
        egl_value: string;
        isTotal: Trigger;
    }[];
}

export interface RoomStat {
    uniqueNo: string;
    value: string;
    isTotal: boolean;
}

export interface RoomsValidationResponse {
    currentRooms?: number;
    maxRooms?: number;
    overLicense: boolean;
    roomsToAdd?: number;
    roomStats?: RoomStat[];
}

export interface RawApartmentDetail extends RawFeature {
    childEntity: {
        e_id: string;
        e_uniqueNo: string;
        isChildOfMine: Trigger
    }[];
    parentEntity: string;
    e_adminOnly: Trigger;
    e_entityGroup_id: string;
    e_id: string;
    e_sortOrder: string;
    maxPersons: string;
    roomNo: string;
}

export interface ApartmentDetail {
    id: number;
    adminOnly: boolean;
    childRooms: {
        id: number;
        uniqueNo: string;
        isChildOfMine: boolean;
    }[];
    parentEntity: string;
    groupId: number;
    sortOrder: string;
    maxPersons: number;
    roomNo: string;
    features: RawFeature;
}


export interface ApartmentDescription {
    localeId: number;
    description: string;
}

export type RawApartmentPictureBody = Omit<RawApartmentPictureEntity, 'ep_entityGroup_id' | 'ep_picPath'> & {
    ep_entityGroup_id: null;
    ep_picPath: null;
};
