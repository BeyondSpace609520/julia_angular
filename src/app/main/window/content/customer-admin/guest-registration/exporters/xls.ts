import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) {
        // tslint:disable-next-line: no-bitwise
        view[i] = s.charCodeAt(i) & 0xFF;
    }

    return buf;
}

export function downloadAsExcel<T>(fields: T, items: {[key in keyof T]: unknown}[], name: string) {
    const data = items.map(item =>
        Object.keys(fields).reduce((acc, field) => ({
            ...acc,
            [fields[field]]: item[field]
        }), {})
    );

    const ws = XLSX.utils.json_to_sheet(data, { dateNF: 'DD.MM.YYYY' });
    const wb = {
        SheetNames: [name],
        Sheets: {
            [name]: ws
        }
    };
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), name + '.xlsx');
}
