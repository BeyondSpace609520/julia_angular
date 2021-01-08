export interface RawFolder {
    fo_id: string | 0;
    fo_folder_id: string | null;
    fo_name: string;
}

export interface Folder {
    id: number;
    name: string;
    children: Folder[];
}

export interface RawFileEntity {
    fi_creationDate: string;
    fi_creationDateUnformatted: string;
    fi_extension: string;
    fi_file_id: string | null;
    fi_folder_id: string;
    fi_id: string;
    fi_name: string;
    fi_path: string;
    fi_sizeInBytes: string;
    fi_versionNo: string;
    pureFilename: string;
    sizeInKB: string;
    urlToFile: string;
}

export interface FileEntity {
    id: number;
    creationDate: Date;
    extension: string;
    folderId: number;
    name: string;
    path: string;
    sizeInBytes: number;
    versionNo: string;
    urlToFile: string;
}
