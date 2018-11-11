/* @flow */

/**
 * Converts any value to string;
 * @param {*} value
 * @returns {Promise<string>}
 */
export function paramToString (value: any): string {
    switch(Object.prototype.toString.call(value)) {
        case '[object Date]':
            return decodeURIComponent(value.toISOString());
        case '[object Object]':
        case '[object Array]':
            return decodeURIComponent(JSON.stringify(value));
        default:
            return decodeURIComponent(value);
    }
}



/**
 * @private
 * Converts field with object value to array of query string keys and values
 * @param {string} key - Field name
 * @param {Object} value - Field value
 * @returns {Array}
 */

export function objectToParams(key: string, value: {[string]: any }): Array<{key: string, value: any}> {
    const keys = Object.keys(value);
    const fields = keys.map(k => ({key: `${key}[${k}]`, value: value[k]}));
    let result = [];
    fields.forEach(res => {
        switch(Object.prototype.toString.call(res.value)) {
            case '[object Object]':
                result = result.concat(objectToParams(res.key, res.value));
                break;
            case '[object Array]':
                result = result.concat(arrayToParam(res.key, res.value));
                break;
            default:
                result.push(res);
        }
    });
    return result;
}

/**
 * @private
 * Converts field with array value to array of query string keys and values
 * @param {string} key - Field name
 * @param {Array} arr - Field value
 * @returns {Array}
 */
export function arrayToParam(key: string, arr: Array<any>): Array<{key: string, value: any}> {
    const fields = arr.map((val, index) => ({key: `${key}[${index}]`, value: val}));
    let result = [];
    fields.forEach(res => {
        switch(Object.prototype.toString.call(res.value)) {
            case '[object Object]':
                result = result.concat(objectToParams(res.key, res.value));
                break;
            case '[object Array]':
                result = result.concat(arrayToParam(res.key, res.value));
                break;
            default:
                result.push(res);
                break;
        }
    });
    return result;
}

/**
 * Converts data object to query string
 * @param {*} object
 * @returns string
 */
export function toQueryString(object: any): string {
    if (Object.prototype.toString.call(object) === '[object Object]') {
        let resultArray: Array<{key: string, value: any}> = [];
        const keys = Object.keys(object);
        keys.forEach(key => {
            const value = object[key];
            switch(Object.prototype.toString.call(value)) {
                case '[object Object]':
                    resultArray = resultArray.concat(objectToParams(key, value));
                    break;
                case '[object Array]':
                    resultArray = resultArray.concat(arrayToParam(key, value));
                    break;
                default:
                    resultArray.push({key, value});
                    break;
            }
        });
        return resultArray.map(item => `${item.key}=${paramToString(item.value)}`).join('&');
    }
    return paramToString(object);
}
