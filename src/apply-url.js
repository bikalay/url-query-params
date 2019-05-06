/* @flow */
import { paramToString, queryString } from './query-string';

/**
 * @private
 * @param {string} url
 * @returns {Array}
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
 * @private
 * @param {string} url
 * @returns {Array}
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
 * Fills url template
 *
 * @param {string} url - Url template
 * @param {*} data - Url data
 * @param {boolean} skipUnexistedInTemplate - skip params not presented in url template
 * @returns {string} - Result url
 */
export function processUrl(url: string, data: any, skipUnexistedInTemplate?: boolean): string {
    const params = getUrlParams(url);
    params.forEach(param => {
        const value = getValue(data, param);
        url = url.replace(':' + param, value !== undefined ? paramToString(value) : '');
    });
    if(skipUnexistedInTemplate) {
        const queryParams = getQueryParams(url);
        const queryData = {};
        queryParams.forEach(param => {
            applyValue(data, param, queryData);
        });
        url = url.replace(/[\&\?]:([^\&\?\/]+)/gi, '');
        url = url.indexOf('?') > -1 ? url + '&' + queryString(queryData) : url + '?' + queryString(queryData);
    }
    return url;
}
