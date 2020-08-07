import {parse, queryString} from '../src/query-string';

test('Stringify flat object', () => {
    expect(queryString({a: 1, b:-2, c: 'c', d: true, e: 1.45})).toBe('a=1&b=-2&c=c&d=true&e=1.45');
});

test('Stringify array object', () => {
    expect(queryString({a: [{b:1, c:2}, {b:3, c:4}]})).toBe('a[0][b]=1&a[0][c]=2&a[1][b]=3&a[1][c]=4');
});

test('Stringify nested object', () => {
    expect(queryString({
        a: {
            p: 1,
            b: {
                m:'m',
                n:5 }
        },
        c: {
            t:'c',
            d: true
        },
        e: 1.45
    })).toBe('a[p]=1&a[b][m]=m&a[b][n]=5&c[t]=c&c[d]=true&e=1.45');
});

test('Stringify nested object and arrays', () => {
    expect(queryString({
        a: {
            p:1,
            b:{
                m:'m',
                n:5
            }
        },
        c: {
            t:'c',
            d: true
        },
        e: [1,2,3],
        g:[
            {key:1, val:2},
            {key:2, val:3}
        ]
    })).toBe('a[p]=1&a[b][m]=m&a[b][n]=5&c[t]=c&c[d]=true&e[0]=1&e[1]=2&e[2]=3&g[0][key]=1&g[0][val]=2&g[1][key]=2&g[1][val]=3');
});

test('Stringify nested deep object and arrays', () => {
    expect(queryString({
        a: {
            p:1,
            b:{
                m:'m',
                n:5
            }
        },
        c: {
            t:'c',
            d: true
        },
        e: [1,2,3],
        g: [
            {key:1, val:[{a:1, b:[1,2,3]}]},
            {key:2, val:[{a:2, b:[3,2,1]}]}
        ]
    })).toBe('a[p]=1&a[b][m]=m&a[b][n]=5&c[t]=c&c[d]=true&e[0]=1&e[1]=2&e[2]=3&g[0][key]=1&g[0][val][0][a]=1&g[0][val][0][b][0]=1&g[0][val][0][b][1]=2&g[0][val][0][b][2]=3&g[1][key]=2&g[1][val][0][a]=2&g[1][val][0][b][0]=3&g[1][val][0][b][1]=2&g[1][val][0][b][2]=1');
});

test('Stringify nested arrays', () => {
    expect(queryString([1, 2, 3, [4, 5, [5, 6, 7]], {a: 6}])).toBe('0=1&1=2&2=3&3[0]=4&3[1]=5&3[2][0]=5&3[2][1]=6&3[2][2]=7&4[a]=6');
});

test('Stringify not object data', () => {
    expect(() => queryString(1)).toThrow(Error);
    expect(() => queryString('hi')).toThrow(Error);
    expect(() => queryString(new Date(0))).toThrow(Error);
    expect(() => queryString('привет')).toThrow(Error);
});

test('Parse query string', () => {
    expect(parse('a=1&b=-2&c=c&d=true&e=1.45')).toStrictEqual({a: 1, b: -2, c: 'c', d: true, e: 1.45});
    expect(parse('a[0][b]=1&a[0][c]=2&a[1][b]=3&a[1][c]=4')).toStrictEqual({a: [{b: 1, c: 2}, {b: 3, c: 4}]});
    expect(parse('a[p]=1&a[b][m]=m&a[b][n]=5&c[t]=c&c[d]=true&e[0]=1&e[1]=2&e[2]=3&g[0][key]=1&g[0][val][0][a]=1&g[0][val][0][b][0]=1&g[0][val][0][b][1]=2&g[0][val][0][b][2]=3&g[1][key]=2&g[1][val][0][a]=2&g[1][val][0][b][0]=3&g[1][val][0][b][1]=2&g[1][val][0][b][2]=1'))
        .toStrictEqual(
            {
                a: {
                    p: 1,
                    b: {
                        m: 'm',
                        n: 5
                    }
                },
                c: {
                    t: 'c',
                    d: true
                },
                e: [1, 2, 3],
                g: [
                    {key: 1, val: [{a: 1, b: [1, 2, 3]}]},
                    {key: 2, val: [{a: 2, b: [3, 2, 1]}]}
                ]
            }
        )
});
