export type PictureSource = 'category' | 'apartment';

export interface PictureEntity {
    id: number;
    entityId: number;
    path: string;
    sortOrder: number;
    tag?: string;
}
