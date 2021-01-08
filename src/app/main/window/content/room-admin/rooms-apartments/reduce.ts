import { PictureEntity } from '../../../shared/image-selector/models';
import { RawFeature } from '../../../shared/room-features/models';
import {
  ApartmentDetail, ApartmentRoom, RawApartmentDetail, RawApartmentPictureBody,
  RawApartmentPictureEntity, RawRoomsValidationResponse, RoomStat, RoomsValidationResponse, RoomType
} from './models';

export function prepareRoomsBody(roomTypeId: RoomType['id'], rooms: ApartmentRoom[]) {
  return {
    entArr: rooms.map(({ no, categoryId, notBookable }) => ({
      eUniqueNo: no,
      egId: categoryId,
      e_adminOnly: notBookable ? 'on' : 'off'
    })),
    et_id: roomTypeId
  };
}


export function reduceValidation(v: RawRoomsValidationResponse): RoomsValidationResponse {
  return {
    currentRooms: v.currentRooms,
    overLicense: v.msg === 'overLicense',
    maxRooms: typeof v.maxRooms === 'string' ? +v.maxRooms : undefined,
    roomsToAdd: v.roomsToAdd,
    roomStats: v.roomstats && v.roomstats.map(r => ({
      uniqueNo: r.e_uniqueNo,
      value: r.egl_value,
      isTotal: r.isTotal === 'on'
    } as RoomStat))
  };
}


export function reduceApartmentDetail(d: RawApartmentDetail): ApartmentDetail {
  const { e_id, parentEntity, childEntity, e_adminOnly, e_entityGroup_id, e_sortOrder, maxPersons, roomNo, ...features } = d;

  return {
    id: +e_id,
    childRooms: childEntity.map((c): ApartmentDetail['childRooms'][0]  => ({
      id: +c.e_id, uniqueNo: c.e_uniqueNo, isChildOfMine: c.isChildOfMine === 'on'
    })),
    adminOnly: e_adminOnly === 'on',
    groupId: +e_entityGroup_id,
    maxPersons: +maxPersons,
    sortOrder: e_sortOrder,
    parentEntity,
    roomNo,
    features: features as RawFeature
  };
}

export function prepareApartmentBody(d: ApartmentDetail) {
  const raw: RawApartmentDetail = {
    e_id: String(d.id),
    e_adminOnly: d.adminOnly ? 'on' : 'off',
    e_entityGroup_id: String(d.groupId),
    maxPersons: String(d.maxPersons),
    e_sortOrder: d.sortOrder,
    parentEntity: d.parentEntity,
    roomNo: d.roomNo,
    childEntity: d.childRooms.map((c): RawApartmentDetail['childEntity'][0] => ({
      e_id: String(c.id),
      e_uniqueNo: c.uniqueNo,
      isChildOfMine: c.isChildOfMine ? 'on' : 'off'
    })),
    ...d.features
  };

  return {
    ...raw,
    e_uniqueNo: raw.roomNo,
    childEntityList: raw.childEntity.filter(c => c.isChildOfMine === 'on').map(c => c.e_id)
  };
}

export function reduceApartmentPicture(p: RawApartmentPictureEntity): PictureEntity {
  return {
      id: +p.ep_id,
      entityId: +p.ep_entityGroup_id,
      path: p.ep_picPath,
      sortOrder: +p.ep_sortOrder
  };
}

export function prepareApartmentPictureBody(p: PictureEntity): RawApartmentPictureBody {
  return {
      ep_id: String(p.id),
      ep_sortOrder: String(p.sortOrder),
      ep_entityGroup_id: null,
      ep_picPath: null
  };
}
