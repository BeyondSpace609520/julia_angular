import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { ExportTableFormatted } from '@/app/main/window/content/customer-admin/guest-registration/exporters/models';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface PdfExportOptions {
  filename: string;
  landscape: boolean;
  fontSize: number;
}

const pdfExportDefaults: PdfExportOptions = {
  filename: 'export',
  landscape: false,
  fontSize: 10
};

export function exportTablesAsPdf(tables: ExportTableFormatted[], options?: Partial<PdfExportOptions>): void {
  const currentOptions = {...pdfExportDefaults, ...options};
  const document = {
    pageOrientation: currentOptions.landscape ? 'landscape' : 'portrait',
    defaultStyle: {
      fontSize: currentOptions.fontSize
    },
    content: tables.map(table => ({
      style: 'table',
      table: {
        headerRows: 1,
        body: [
          table.headers.map(header => prepareHeaderField(header)),
          ...table.data,
          ...(table.footers
            ? table.footers.map(footerRow => footerRow.map(footer => (prepareFooterField(footer))))
            : []
          )
        ]
      }
    })),
    styles: {
      table: {
        margin: [0, 0, 0, 10]
      },
      tableHeader: {
        bold: true,
        color: 'black'
      },
      tableFooter: {
        bold: true
      }
    }
  };
  pdfMake.createPdf(document).download(currentOptions.filename);
}

function prepareHeaderField(headerField: string): {text: string, [key: string]: string} {
  return {text: headerField, style: 'tableHeader', fillColor: '#dddddd'};
}

function prepareFooterField(footerField: string): {text: string, [key: string]: string} {
  return {text: footerField, style: 'tableFooter', fillColor: '#eeeeee'};
}
