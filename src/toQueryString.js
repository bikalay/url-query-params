/* @flow */

/**
 * This function converts any value to encoded string;
 *
 * @example
 * paramToString(1) // -> '1'
 * @example
 * paramToString(new Date()) // -> '2018-11-11T17%3A22%3A58.937Z'
 * @example
 * paramToString('m&m\'s') // -> 'm%26m's'
 * @example
 * paramToString('привет') // -> '%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82'
 *
 * @param {*} value - any value need to convert to string
 * @returns {string} - result encoded string
 */
export function paramToString (value: any): string {
    switch(Object.prototype.toString.call(value)) {
        case '[object Date]':
            return encodeURIComponent(value.toISOString());
        case '[object Object]':
        case '[object Array]':
            return encodeURIComponent(JSON.stringify(value));
        default:
            return encodeURIComponent(value);
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
 * This function converts data object to query string
 *
 * @example
 * toQueryString({a: 1, b: 2, c: 'foo'}) // -> 'a=b&b=2&c=foo'
 * @example
 * toQueryString({a: [1,2,3], b: {c: 4, d: 5}}) // -> 'a[0]=1&a[1]=2&a[2]=3&b[c]=4&b[d]=5'
 * @example
 * toQueryString({a: [{b: 1, c: 2}, {b: 3, c: 4}]}) // -> 'a[0][b]=1&a[0][c]=2&a[1][b]=3&a[1][c]=4'
 *
 * @param {Object} object - Data object to convert to query string
 * @returns string - Result query string
 */
export function toQueryString(object: {[string]: any }): string {
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
