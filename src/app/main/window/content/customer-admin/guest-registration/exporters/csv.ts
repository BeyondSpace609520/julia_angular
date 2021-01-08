import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

export function downloadAsCSV<T>(fields: T, items: {[key in keyof T]: unknown}[], name: string) {
    const header = Object.values(fields);
    const lines = items.map(item =>
      Object.keys(fields).map(key => {
        const value = item[key];
        if (value instanceof Date) {
            return dayjs(value).format('DD.MM.YYYY');
        }
        if (typeof value === 'string' && value.match(/[-0-9]+\/[-0-9]+/)) {
          return `="${value}"`;
        }
        return value;
      })
    );
    const csv = [header, ...lines].map(v => v.join(';')).join('\n');

    saveAs(new Blob([csv]), `${name}.csv`);
}
