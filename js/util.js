"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = void 0;
const memoize = f => {
    const m = new Map([]);
    return (...args) => {
        // const key = m.keys().find(keys => keys.every((key , i) => key === args[i]))
        // if (key !== undefined) return m.get(key)
        // const value = f(...args)
        // m.set(args, value)
        // return value
    };
};
exports.memoize = memoize;
