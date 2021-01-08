import { FormatService } from '@/ui-kit/services/format.service';
import { ExportTable, ExportTableFormatted } from './models';

export function formatExportTable(
  exportTable: ExportTable,
  formatService: FormatService,
  dateFormat: string
): ExportTableFormatted {
  const {headers, keys} = prepareHeaders(exportTable.headers);
  return {
    headers,
    data: prepareData(exportTable.data, keys, formatService, dateFormat),
    footers: exportTable.footers ? prepareData(exportTable.footers, keys, formatService, dateFormat) : undefined,
  };
}

function prepareHeaders(headers: ExportTable['headers']): {headers: string[], keys: string[]} {
  return {
    headers: Object.keys(headers).map(key => headers[key]),
    keys: Object.keys(headers)
  };
}

function prepareData(
  data: ExportTable['data'],
  keys: string[],
  formatService: FormatService,
  dateFormat: string
): string[][] {
  const rawData = data.map(row => prepareRow(row, keys));
  return rawData.map(row => row.map(field => formatField(field, formatService, dateFormat)));
}

function prepareRow(row: ExportTable['data'][0], keys: string[]): (string | number | Date)[] {
  return keys.map(field => row[field] || '');
}

function formatField(
  field: string | number | Date,
  formatService: FormatService,
  dateFormat: string
): string {
  if (field === undefined || field === null) {
    return '';
  }
  if (typeof field === 'string') {
    return field;
  }
  if (typeof field === 'number') {
    return formatService.numberFormat(+field) || '';
  }
  if (typeof field === 'object' && typeof field.getMonth === 'function') {
    return formatService.dateFormat(field, dateFormat) || '';
  }
  return field.toString();
}

