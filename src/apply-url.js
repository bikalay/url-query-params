/* @flow */
import { paramToString, queryString } from './query-string';

/**
 * Returns array of query string parameters from url template string
 * @private
 * @param {string} url - url template string
 * @returns {Array} - array or query string params
 */
export function getQueryParams(url: string): Array<string> {
    let currentFieldArr;
    const regExp = /[\&\?]:([^\&\?\/]+)/gi;
    const params = [];
    while ((currentFieldArr = regExp.exec(url)) !== null) {
        if(currentFieldArr && currentFieldArr.length > 1) {
            params.push(currentFieldArr[1]);
        }
    }
    return params;
}

/**
 * Returns array of url parameters from url template string
 * @private
 * @param {string} url - url template string
 * @returns {Array} - array url params
 */
export function getUrlParams(url: string): Array<string> {
    let currentFieldArr;
    const regExp = /\/:([^\&\?\/]+)/gi;
    const params = [];
    while ((currentFieldArr = regExp.exec(url)) !== null) {
        if(currentFieldArr && currentFieldArr.length > 1) {
            params.push(currentFieldArr[1]);
        }
    }
    return params;
}

/**
 * @private
 * Extract field value by field name
 *
 * @example
 * getValue({a: 2}, 'a') // -> 2
 * @example
 * getValue({a: {b: {c: 5}}}, 'a.b.c') // -> 5
 *
 * @param {*} data
 * @param {string} fieldName
 * @returns {*}
 */
export function getValue(data: any, fieldName: string): any {
    const fieldArr = fieldName.split('.');
    // noinspection LoopStatementThatDoesntLoopJS
    for (let i = 0; i < fieldArr.length; i++) {
        const part = fieldArr[i];
        const type = Object.prototype.toString.call(data);
        if (type === '[object Object]' || type === '[object Array]') {
            data = data[part];
        } else {
            return;
        }
    }
    return data;
}

/**
 * @private
 * @param {*} data
 * @param {string} fieldName
 * @param {*} resultObj
 * @returns {*}
 */
export function applyValue(data: any, fieldName: string, resultObj: any): any {
    const fieldArr = fieldName.split('.');
    let result: any = resultObj;
    fieldArr.forEach((part, index) => {
        const type = Object.prototype.toString.call(data);
        if (type === '[object Object]' || type === '[object Array]') {
            data = data[part];
        } else {
            data = undefined;
        }
        if(index < fieldArr.length - 1) {
            result = result[part] = result[part] ||
                (Object.prototype.toString.call(data) === '[object Array]' ? [] : {});
        } else {
            result[part] = data;
        }
    });
    return resultObj;
}

/**
 * Fills the url template
 *
 * @example
 * processUrl('http://example.org/test/:fieldOne/test2/:fieldTwo', {fieldOne: 1000, fieldTwo: 'test3'}) // -> 'http://example.org/test/1000/test2/test3'
 *
 * @example
 * processUrl('http://example.org/test/:fieldOne/?:fieldTwo', {fieldOne: 1000, fieldTwo: 'test3'}) // -> 'http://example.org/test/1000/?fieldTwo=test3'
 *
 * @param {string} url - Url template string
 * @param {*} templateData - Template data object
 * @param {*=} queryData - Additional query string data object
 * @returns {string} - Result url
 */
export function processUrl(url: string, templateData: any, queryData: ?any): string {
    const params = getUrlParams(url);
    params.forEach(param => {
        const value = getValue(templateData, param);
        url = url.replace(':' + param, value !== undefined ? paramToString(value) : '');
    });
    const queryParams = getQueryParams(url);
    const templateQueryData = {};
    queryParams.forEach(param => {
        applyValue(templateData, param, templateQueryData);
    });
    url = url.replace(/[\&\?]:([^\&\?\/]+)/gi, '');
    if(Object.keys(templateQueryData).length > 0) {
        url = url.indexOf('?') > -1 ? url + '&' + queryString(templateQueryData) : url + '?' + queryString(templateQueryData);
    }
    if(queryData) {
        url = url.indexOf('?') > -1 ? url + '&' + queryString(queryData) : url + '?' + queryString(queryData);
    }
    return url;
}
