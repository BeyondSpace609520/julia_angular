export interface RawCategoryPictureEntity {
  egp_entityGroup_id: string;
  egp_id: string;
  egp_picPath: string;
  egp_sortOrder: string;
}

export interface RoomCategory {
  id: number;
  name: string;
  sortOrder: string;
  locals: {
    title: string;
    description: string;
    priceInfo: string;
    localeId: string;
    localeEntryId: string //  id of the language specific category entry in the database
  }[];
  raw: RawRoomCategory;
  preselectThis?: boolean;
}

export interface RawRoomCategory {
  eg_entityType_id: string;
  eg_gapFillMinStay: string;
  eg_id: string;
  eg_name: string;
  eg_priceConfirmationComments: string | null;
  eg_priceConfirmationDate: string | null;
  eg_priceConfirmationStatus: string | 'pending';
  eg_sortOrder: string;
  eg_thumbSketchPic: string | null;
  egl_entityGroup_id: string;
  egl_id: string;
  egl_locale_id: string;
  egl_priceInfoText: string | null;
  egl_priceInfoTextHTML: string | null;
  egl_value: string;
  egl_valueLongDesc: string;
  egl_valueLongDescHTML: string | null;
  preselectThis: boolean;
}

export type RawCategoryPictureBody = Omit<RawCategoryPictureEntity, 'egp_entityGroup_id' | 'egp_picPath'> & {
  egp_entityGroup_id: null;
  egp_picPath: null;
};
