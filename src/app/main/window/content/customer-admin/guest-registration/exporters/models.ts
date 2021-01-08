export interface ExportTable {
  headers: {[key: string]: string};
  data: {[key: string]: string | number | Date}[];
  footers?: {[key: string]: string | number | Date}[];
}

export interface ExportTableFormatted {
  headers: string[];
  data: string[][];
  footers?: string[][];
}
