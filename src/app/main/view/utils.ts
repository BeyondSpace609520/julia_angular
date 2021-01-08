import _ from 'lodash';

import { ViewSettings } from '@/app/main/view/models';
import views from '@/app/main/view/views.json';

export function getViewSettings(viewId: string): ViewSettings | undefined {
  const viewSettings = views as ViewSettings[];
  return _.cloneDeep(viewSettings.find(settings => settings.id === viewId));
}
