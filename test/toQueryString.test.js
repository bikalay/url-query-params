import {toQueryString} from '../src/toQueryString';

test('Stringify flat object', () => {
    expect(toQueryString({a: 1, b:-2, c: 'c', d: true, e: 1.45})).toBe('a=1&b=-2&c=c&d=true&e=1.45');
});

test('Stringify nested object', () => {
    expect(toQueryString({
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
    expect(toQueryString({
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
    expect(toQueryString({
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
            {key:1, val:[{a:1, b:[1,2,3]}]},
            {key:2, val:[{a:2, b:[3,2,1]}]}
        ]
    })).toBe('a[p]=1&a[b][m]=m&a[b][n]=5&c[t]=c&c[d]=true&e[0]=1&e[1]=2&e[2]=3&g[0][key]=1&g[0][val][0][a]=1&g[0][val][0][b][0]=1&g[0][val][0][b][1]=2&g[0][val][0][b][2]=3&g[1][key]=2&g[1][val][0][a]=2&g[1][val][0][b][0]=3&g[1][val][0][b][1]=2&g[1][val][0][b][2]=1');
});
