export type OnInsertFunction = (name: string) => Promise<boolean>;
export type OnChangeFunction = (valid: boolean) => void | Promise<void>;

