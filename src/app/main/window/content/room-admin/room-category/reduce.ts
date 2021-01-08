import { PictureEntity } from '../../../shared/image-selector/models';
import { RawCategoryPictureBody, RawCategoryPictureEntity, RawRoomCategory, RoomCategory } from './models';

export function reduceRoomCategory(roomCategory: RawRoomCategory, related: RawRoomCategory[]): RoomCategory {
  return {
    id: +roomCategory.eg_id,
    name: roomCategory.eg_name,
    sortOrder: roomCategory.eg_sortOrder,
    locals: related.map(category => ({
      title: category.egl_value,
      description: category.egl_valueLongDescHTML,
      priceInfo: category.egl_priceInfoTextHTML,
      localeId: category.egl_locale_id,
      localeEntryId: category.egl_id
    }) as RoomCategory['locals'][0]),
    preselectThis: roomCategory.preselectThis,
    raw: roomCategory
  };
}


export function prepareCategoryBody(c: RoomCategory) {
  const extractText = html => {
    const el = document.createElement('div');

    el.innerHTML = html;
    return el.innerText;
  };

  return {
    eg_id: c.id,
    eg_name: c.name,
    eg_sortOrder: c.sortOrder,
    egls: c.locals.map(data => {
      return {
        egl_valueLongDescHTML: data.description,
        egl_valueLongDesc: extractText( data.description),
        egl_priceInfoTextHTML: data.priceInfo,
        egl_priceInfoText: extractText(data.priceInfo),
        egl_value: data.title,
        l_id: data.localeId,
        egl_id: data.localeEntryId
      };
    })
  };
}

export function reduceCategoryPicture(p: RawCategoryPictureEntity): PictureEntity {
  return {
    id: +p.egp_id,
    entityId: +p.egp_entityGroup_id,
    path: p.egp_picPath,
    sortOrder: +p.egp_sortOrder
  };
}

export function prepareCategoryPictureBody(p: PictureEntity): RawCategoryPictureBody {
  return {
    egp_id: String(p.id),
    egp_sortOrder: String(p.sortOrder),
    egp_entityGroup_id: null,
    egp_picPath: null
  };
}
