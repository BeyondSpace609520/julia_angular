import { EmbedContentSource } from '@/app/main/embed/models';
import { PermissionId } from '@/app/main/permission/models';
import { WindowContentSource } from '@/app/main/window/models';

export interface ViewSettings {
  id: string;
  label: string;
  contentSource?: WindowContentSource | EmbedContentSource;
  permission?: PermissionId;
}
