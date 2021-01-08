export function isPrice(val: string) {
    return val.startsWith('€ ');
}

export function parsePrice(val: string): number {
    return parseFloat(val.replace(/[€$]/, ''));
}
