/* @flow */
import { paramToString, queryString } from './query-string';

/*export function processUrl(url: string ='', data: any): string {

    resultUrl = resultUrl.replace(/[\&\?]:[^\&\?]+/g, '')
        .replace(/\/:[^\&\?\/]+/g, '');
    return resultUrl.indexOf('?') > -1 ? resultUrl : resultUrl.replace(/\&/, '?');
}*/

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



/*
/!**
 * Prepares url
 * @param {string} url - Url string
 * @param {*} [data] - Request data
 * @returns {string}
 *!/
export function processUrl(url: string ='', data: any): string {
    let resultUrl = objectToParam(url, data);
    resultUrl = resultUrl.replace(/[\&\?]:[^\&\?]+/g, '')
        .replace(/\/:[^\&\?\/]+/g, '');
    return resultUrl.indexOf('?') > -1 ? resultUrl : resultUrl.replace(/\&/, '?');
}

export function objectToParam(url: string, obj: any, key?: ?string): string {
    let fieldNames = Object.keys(obj);
    for(let i=0, length = fieldNames.length; i<length; i++) {
        let fieldName = fieldNames[i];
        let value = obj[fieldName];
        let _key = key ? key+'.'+fieldName : fieldName;
        switch(Object.prototype.toString.call(value)) {
            case '[object Object]':
                url = objectToParam(url, value, _key);
                break;
            case '[object Array]':
                for(let j=0; j<value.length; j++) {
                    url = updateUrl(url, _key, value[j]);
                }
                break;
            default:
                url = updateUrl(url, _key, value);
                break;
        }
    }
    return url;
}

/!**
 *
 * @param {string} url
 * @param {string} key
 * @param {*} value
 * @param {boolean} [skip]
 * @returns {string}
 *!/
export function updateUrl(url: string, key: string, value: any, skip?: boolean): string {
    let processed = skip || false;
    value = paramToString(value);

    const paramRegExp = new RegExp('(\/):'+key+'([\/\&\?]|$)','igm');
    const queryRegExp = new RegExp('[\&\?]:'+key, 'igm');
    const _isFirstQueryParameter: boolean = isFirstQueryParameter(key, url);

    if(paramRegExp.test(url)) {
        url = url.replace(paramRegExp, '$1'+value+'$2');
        processed = true;
    }
    key = pathToQueryParam(key);
    if(queryRegExp.test(url)) {
        url = url.replace(queryRegExp, _isFirstQueryParameter ? '?'+key+'='+value : '&'+key+'='+value);
        processed = true;
    }
    if(!processed) {
        url = url + (_isFirstQueryParameter ? '?'+key+'='+value : '&'+key+'='+value);
    }
    return url;
}

function isFirstQueryParameter(field: string, url: string) {
    const firstQuestionMark = url.indexOf('?');
    const fieldQuestionMark = url.indexOf('?:'+field);
    return firstQuestionMark < 0 || firstQuestionMark === fieldQuestionMark;
}

function pathToQueryParam(path: string) {
    const fields = path.split('.');
    let param = fields[0];
    if(fields.length > 1) {
        for (let i = 1; i < fields.length; i++) {
            param = param + '[' + fields[i] + ']';
        }
    }
    return param;
}*/
