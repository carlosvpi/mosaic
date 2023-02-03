"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeTile_1 = require("./NodeTile");
const Mosaic = (tagAttrs, ...objects) => {
    // if (tagAttrs instanceof Function) {
    // 	const defaults = objects[0]
    // 	return (...attrs) => (...children) => {
    // 		tile = tagAttrs()
    // 		if (typeof children[0] === 'function') {
    // 			let ch, rch
    // 			children[0](list => {
    // 				ch = list;
    // 				tile.children(ch, ch.filter(c => !rch.includes(c)))
    // 			})
    // 			typeof children[1] === 'function' && children[1](list => {
    // 				rch = list;
    // 				tile.children(ch, ch.filter(c => !rch.includes(c)))
    // 			})
    // 			return tile
    // 		}
    // 		return tile.children(children)
    // 	}
    // }
    let tile;
    if (tagAttrs instanceof Element) {
        tile = new NodeTile_1.NodeTile(tagAttrs);
    }
    else {
        const rawTagAttrs = tagAttrs.raw;
        const match0 = rawTagAttrs[0].match(/^\s*([a-zA-Z_][a-zA-Z\-_0-9]*)\s*/);
        if (!match0) {
            throw new Error(`Expected a tag name, reading "${rawTagAttrs.join('')}"[${0}]`);
        }
        let accLength = match0[0].length;
        let tagAttrsIndex = 0;
        const attrs = {};
        const [_0, tag] = match0;
        tile = new NodeTile_1.NodeTile(tag);
        let str = rawTagAttrs[0].slice(match0[0].length);
        if (str.length && str[0] !== '[') {
            throw new Error(`Expected "[", reading "${rawTagAttrs.join('')}"[${accLength}]`);
        }
        str = str.slice(1);
        accLength++;
        while (str.length) {
            const match1 = str.match(/^\s*([a-zA-Z\-_0-9]+)\s*/);
            if (!match1) {
                throw new Error(`Expected an attribute name, reading "${rawTagAttrs.join('')}"[${accLength}]`);
            }
            accLength += match1[0].length;
            const [_1, attr] = match1;
            str = str.slice(match1[0].length);
            if (str[0] === ']') {
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
                if (str[0] === ']') {
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
                if (str[0] === ']') {
                    break;
                }
                if (str[0] !== ';') {
                    throw new Error(`Expected ["]", ";"], reading "${rawTagAttrs.join('')}"[${accLength}]`);
                }
                str = str.slice(1);
                accLength++;
            }
        }
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
            let ch, rch;
            children[0](list => {
                ch = list;
                tile.children(ch, ch.filter(c => !rch.includes(c)));
            });
            typeof children[1] === 'function' && children[1](list => {
                rch = list;
                tile.children(ch, ch.filter(c => !rch.includes(c)));
            });
            return tile;
        }
        return tile.children(children);
    };
};
// @ts-ignore
module.exports = Mosaic;
