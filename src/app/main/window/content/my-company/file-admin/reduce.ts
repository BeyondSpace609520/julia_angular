import { FileEntity, Folder, RawFileEntity, RawFolder } from './models';
import { parseDate } from '@/app/helpers/date';

function reduceFolder(f: RawFolder, findChildren: (f: RawFolder) => RawFolder[]): Folder {
    return {
        id: +f.fo_id,
        name: f.fo_name,
        children: findChildren(f).map(child => reduceFolder(child, findChildren))
    };
}


export function reduceFolders(folders: RawFolder[]): Folder[] {
    const rawRoots = folders.filter(folder => folder.fo_folder_id === null);

    return rawRoots.map(root => {
        const findChildren = (f: RawFolder) => folders.filter(child => child.fo_folder_id !== null && +child.fo_folder_id === +f.fo_id);

        return reduceFolder(root, findChildren);
    });
}

export function reduceFile(f: RawFileEntity): FileEntity {
    return {
        id: +f.fi_id,
        name: f.pureFilename,
        extension: f.fi_extension,
        creationDate: parseDate(f.fi_creationDateUnformatted),
        folderId: +f.fi_folder_id,
        path: f.fi_path,
        sizeInBytes: +f.fi_sizeInBytes,
        urlToFile: f.urlToFile,
        versionNo: f.fi_versionNo
    };
}
