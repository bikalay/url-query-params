import { applyValue, getQueryParams, getUrlParams, getValue, processUrl } from '../src/apply-url';


test('getQueryParams', () => {
    expect(getQueryParams('http://example.org/api/v1/test/:fieldOne/test2/:fieldTwo')).toEqual([]);
    expect(getQueryParams('http://example.org/api/v1/test/:fieldOne/:fieldTwo?:fieldThree&:fieldFour')).toEqual(['fieldThree', 'fieldFour']);
    expect(getQueryParams('http://example.org/api/v1/test/:fieldOne/:fieldTwo?test=6?:fieldThree&:fieldFour')).toEqual(['fieldThree', 'fieldFour']);
    expect(getQueryParams('http://example.org/api/v1/test/:fieldOne/:fieldTwo?test=test&test1=7?:fieldThree?:fieldFour')).toEqual(['fieldThree', 'fieldFour']);
    expect(getQueryParams('http://example.org/api/v1/test/:fieldOne/:fieldTwo?test=test?:fieldThree&test1=7?:fieldFour')).toEqual(['fieldThree', 'fieldFour']);
});

test('getUrlParams', () => {
    expect(getUrlParams('http://example.org/api/v1/test/:fieldOne/test2/:fieldTwo')).toEqual(['fieldOne', 'fieldTwo']);
    expect(getUrlParams('http://example.org/api/v1/test/:fieldOne/:fieldTwo?:fieldThree&:fieldFour')).toEqual(['fieldOne', 'fieldTwo']);
});

test('getValue', () => {
    expect(getValue({a: {b: {c: 5}}}, 'a.b.c')).toBe(5);
    expect(getValue({a: {b: {c: 5}}}, 'a.e.c')).toBe(undefined);
    expect(getValue({a: {b: {c: [5]}}}, 'a.b.c.0')).toBe(5);
    expect(getValue({a: {b: {c: [5]}}, d: 6}, 'd')).toBe(6);
});

test('applyValue', () => {
    expect(applyValue({a: {b: {c: 5}, d: {f: 7}}, e: 6}, 'a.b.c', {})).toEqual({a: {b: {c: 5}}});
    expect(applyValue({a: [{c: 5}, {f: 7}], e: 6}, 'a.0.c', {})).toEqual({a: [{c: 5}]});
    expect(applyValue({a: [{c: 5}, {f: 7}], e: 6}, 'a.0.c', {b:5})).toEqual({a: [{c: 5}], b: 5});
    expect(applyValue({a: {b: {c: 5}, d: {f: 7}}, e: 6}, 'a.b.c', {a: {e:6}})).toEqual({a: {b: {c: 5}, e: 6}});
});

test('processUrl', () => {
    expect(processUrl('http://example.org/api/v1/test/:fieldOne/test2/:fieldTwo', { fieldOne: 'test1', fieldTwo: 1000 }))
        .toBe('http://example.org/api/v1/test/test1/test2/1000');
    expect(processUrl('http://example.org/api/v1/test/:fieldOne/test2/:fieldTwo.fieldFor', { fieldOne: 'test1', fieldTwo: { fieldFor: 1000 } }))
        .toBe('http://example.org/api/v1/test/test1/test2/1000');
    expect(processUrl('http://example.org/api/v1/test/:fieldOne/:fieldFive/:fieldTwo.fieldFor', { fieldOne: 'test1', fieldTwo: { fieldFor: 1000 } }))
        .toBe('http://example.org/api/v1/test/test1//1000');
    expect(processUrl('http://example.org/api/v1/test/:fieldOne/:fieldTwo?:fieldThree&:fieldFour', { fieldOne: 'test1', fieldTwo: 1000, fieldThree: 6, fieldFour: 'test4' }, true))
        .toBe('http://example.org/api/v1/test/test1/1000?fieldThree=6&fieldFour=test4');
    expect(processUrl('http://example.org/api/v1/test/:fieldOne/:fieldTwo?test=6?:fieldThree&:fieldFour', { fieldOne: 'test1', fieldTwo: 1000, fieldThree: 6, fieldFour: 'test4' }, true))
        .toBe('http://example.org/api/v1/test/test1/1000?test=6&fieldThree=6&fieldFour=test4');
    expect(processUrl('http://example.org/api/v1/test/:fieldOne/:fieldTwo?test=test&test1=7?:fieldThree?:fieldFour', { fieldOne: 'test1', fieldTwo: 1000, fieldThree: 6, fieldFour: 'test4' }, true))
        .toBe('http://example.org/api/v1/test/test1/1000?test=test&test1=7&fieldThree=6&fieldFour=test4');
    expect(processUrl('http://example.org/api/v1/test/:fieldOne/:fieldTwo?test=test?:fieldThree&test1=7?:fieldFour', { fieldOne: 'test1', fieldTwo: 1000, fieldThree: 6, fieldFour: 'test4' }, true))
        .toBe('http://example.org/api/v1/test/test1/1000?test=test&test1=7&fieldThree=6&fieldFour=test4');

});
