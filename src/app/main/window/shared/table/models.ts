export interface TableField {
  id: string;
  label: string;
  type: TableFieldType;
  sortable: boolean;
  exportable?: boolean;
}

export enum TableFieldType {
  Text = 'text',
  Date = 'date',
  Numeric = 'numeric',
  NumericFormatted = 'numericFormatted',
  TextArray = 'textArray',
}
