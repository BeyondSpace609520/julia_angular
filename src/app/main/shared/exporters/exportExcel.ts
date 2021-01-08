import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import { ExportFields } from '@/app/main/window/shared/services/export.service';

function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);

  for (let i = 0; i !== s.length; ++i) {
    // tslint:disable-next-line: no-bitwise
    view[i] = s.charCodeAt(i) & 0xFF;
  }

  return buf;
}

function displayValue(value: any): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    if (typeof value.getMonth === 'function') {
      return value;
    }
  }
  return value.toString();
}

export function exportAsExcel<T>(fields: ExportFields, items: T[], name: string) {
  const data = items.map(item =>
    Object.keys(fields).reduce((acc, field) => ({
      ...acc,
      [fields[field]]: displayValue(item[field])
    }), {})
  );

  const ws = XLSX.utils.json_to_sheet(data, { dateNF: 'DD.MM.YYYY' });
  const wb = {
    SheetNames: [name],
    Sheets: {
      [name]: ws
    }
  };
  const wbOut = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

  saveAs(new Blob([s2ab(wbOut)], { type: 'application/octet-stream' }), name + '.xlsx');
}

export function exportHTMLTableAsExcel(data: string, name: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  const table = doc.querySelector('table');
  const ws = XLSX.utils.table_to_sheet(table, { dateNF: 'DD.MM.YYYY' });
  const wb = {
    SheetNames: [name],
    Sheets: {
      [name]: ws
    }
  };
  const wbOut = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
  saveAs(new Blob([s2ab(wbOut)], { type: 'application/octet-stream' }), name + '.xlsx');
}
