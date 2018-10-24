/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

export type ValueConverter<T> = (val: unknown) => T | null;

// Utils

function checkNull<T>(arr: Array<T | null>): arr is Array<T> {
    return !arr.some(v => v === null);
}

function convertArray<T>(val: unknown, innerConverter: ValueConverter<T>): Array<T> | null {
    if (Array.isArray(val)) return convertArrayMembers(val, innerConverter);
    if (typeof val === 'string') return convertArrayMembers(val.split(','), innerConverter);
    const valConv = innerConverter(val);
    if (valConv !== null) return [valConv];
    return null;
}

function convertArrayMembers<T>(valArr: Array<unknown>, innerConverter: ValueConverter<T>): Array<T> | null {
    const strArr = valArr.map(v => innerConverter(v));
    if (checkNull<T>(strArr)) return strArr;
    else return null;
}

// Converters

export function convertStringArray(val: unknown): Array<string> | null {
    return convertArray<string>(val, convertString);
}

export function convertNumberArray(val: unknown): Array<number> | null {
    return convertArray<number>(val, convertNumber);
}

export function convertDateArray(val: unknown): Array<Date> | null {
    return convertArray<Date>(val, convertDate);
}

export function convertDate(val: unknown): Date | null {
    if (val instanceof Date) return val;
    if (typeof val === 'number') return new Date(val);
    if (typeof val === 'string') return new Date(val);
    return null;
}

export function convertBoolean(val: unknown): boolean | null {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return !!val;
    if (typeof val === 'string') {
        if (["t", "true", "y", "yes", "1"].some(s => val.localeCompare(s, undefined, { sensitivity: 'base' }) === 0)) return true;
        if (["f", "false", "n", "no", "0"].some(s => val.localeCompare(s, undefined, { sensitivity: 'base' }) === 0)) return false;
    }
    return null;
}

export function convertString(val: unknown): string | null {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return `${val}`;
    if (typeof val === 'boolean') return `${val}`;
    return null;
}

export function convertNumber(val: unknown): number | null {
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return +val;
    if (typeof val === 'string') {
        const conv = parseFloat(val);
        if (!Number.isNaN(conv)) return conv;
    }
    return null;
}
