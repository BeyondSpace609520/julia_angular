import { ValidatorFn } from '@angular/forms';

export type FieldTypes = 'input' | 'select' | 'datepicker' | 'multiselect' | 'checkbox' | 'auto-city-input';
export type Field<Props, Resources, ExtraOptions = {}> = [FieldTypes, string, Props, (ExtraOptions & {
    resource?: Resources;
    validators?: ValidatorFn[];
    onClickLabel?: () => void;
    tooltip?: any;
    disabled?: boolean;
    required?: boolean;
    highlight?: boolean;
    minDate?: Date;
    icon?: string;
    dependencies?: {key: string, field: string}[]
})?];
