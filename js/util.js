"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttrsFromTemplate = exports.memoize = void 0;
const memoize = f => {
    const m = new Map([]);
    return (...args) => {
        const key = [...m.keys()].find(keys => keys.every((key, i) => key === args[i]));
        if (key !== undefined)
            return m.get(key);
        const value = f(...args);
        m.set(args, value);
        return value;
    };
};
exports.memoize = memoize;
const getAttrsFromTemplate = (terminator, rawTagAttrs, ...objects) => {
    let accLength = 0;
    let tagAttrsIndex = 0;
    const attrs = {};
    let str = rawTagAttrs[0];
    while (str.length) {
        const match1 = str.match(/^\s*([a-zA-Z\-_0-9]+)\s*/);
        if (!match1) {
            throw new Error(`Expected an attribute name, reading "${rawTagAttrs.join('')}"[${accLength}]`);
        }
        accLength += match1[0].length;
        const [_1, attr] = match1;
        str = str.slice(match1[0].length);
        if (str[0] === terminator) {
            attrs[attr] = true;
            break;
        }
        if (str[0] === ';') {
            attrs[attr] = true;
            str = str.slice(1);
            continue;
        }
        if (str[0] !== '=') {
            throw new Error(`Expected ["=", "]", ";"], reading "${rawTagAttrs.join('')}"[${accLength}]`);
        }
        str = str.slice(1);
        accLength++;
        let match2 = str.match(/^\s*([a-zA-Z\-_0-9]+)\s*/);
        match2 || (match2 = str.match(/^\s*[\']([a-zA-Z\-_0-9\s\"]*)[\']\s*/));
        match2 || (match2 = str.match(/^\s*[\"]([a-zA-Z\-_0-9\s\']*)[\"]\s*/));
        if (match2) {
            accLength += match2[0].length;
            const [_2, value] = match2;
            str = str.slice(match2[0].length);
            attrs[attr] = value;
            if (str[0] === terminator) {
                break;
            }
            if (str[0] !== ';') {
                throw new Error(`Expected ["]", ";"], reading "${rawTagAttrs.join('')}"[${accLength}]`);
            }
            str = str.slice(1);
            accLength++;
        }
        else {
            attrs[attr] = objects[tagAttrsIndex];
            tagAttrsIndex++;
            str += rawTagAttrs[tagAttrsIndex];
            const [matchSpaces] = str.match(/^\s*/);
            str = str.slice(matchSpaces.length);
            accLength += matchSpaces.length;
            if (str[0] === terminator) {
                break;
            }
            if (str[0] !== ';') {
                throw new Error(`Expected ["]", ";"], reading "${rawTagAttrs.join('')}"[${accLength}]`);
            }
            str = str.slice(1);
            accLength++;
        }
    }
    return attrs;
};
exports.getAttrsFromTemplate = getAttrsFromTemplate;
