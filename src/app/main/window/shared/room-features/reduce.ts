import { RawFeature } from './models';

export function prepareBody(rawForm: any[]): RawFeature {
    const body = rawForm.reduce((obj, column) => ({ ... obj, ...column }), {});
    Object.keys(body).forEach(key => {
        body[key] = typeof body[key] === 'boolean' ? (body[key] ? 'on' : 'off') : String(body[key]);
    });

    return body;
}
