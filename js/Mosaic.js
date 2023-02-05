"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeTile_1 = require("./NodeTile");
const util_1 = require("./util");
const Mosaic = (tagAttrs, ...objects) => {
    if (tagAttrs instanceof Function) {
        const defaults = objects[0];
        return (0, util_1.memoize)((template, ...args) => {
            const attrs = (0, util_1.getAttrsFromTemplate)(undefined, template, ...args);
            const props = Object.assign(Object.assign({}, defaults), attrs);
            return tagAttrs(props);
        });
    }
    let tile;
    if (tagAttrs instanceof Element) {
        tile = new NodeTile_1.NodeTile(tagAttrs);
    }
    else {
        const [first, ...rawTagAttrs] = tagAttrs.raw;
        const match0 = first.match(/^\s*([a-zA-Z_][a-zA-Z\-_0-9]*)\s*/);
        if (!match0) {
            throw new Error(`Expected a tag name, reading "${rawTagAttrs.join('')}"[0]`);
        }
        const str = first.slice(match0[0].length);
        if (str.length && str[0] !== '[') {
            throw new Error(`Expected "[", reading "${rawTagAttrs.join('')}"[${match0[0].length}]`);
        }
        const attrs = (0, util_1.getAttrsFromTemplate)(']', [str.slice(1), ...rawTagAttrs], ...objects);
        tile = new NodeTile_1.NodeTile(match0[1]);
        Object.keys(attrs).forEach(attrKey => {
            if (typeof attrs[attrKey] === 'function') {
                attrs[attrKey](value => tile.attr(attrKey, value));
            }
            else {
                tile.attr(attrKey, attrs[attrKey]);
            }
        });
    }
    return (...children) => {
        if (typeof children[0] === 'function') {
            children[0](list => {
                tile.children(list.map(([child, _]) => child), candidateChild => list.find(([child]) => candidateChild === child)[1]);
            });
            return tile;
        }
        return tile.children(children, () => true);
    };
};
// @ts-ignore
module.exports = Mosaic;
