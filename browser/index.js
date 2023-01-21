yarn run v1.16.0
$ /Users/carlos/Development/repos/mosaic/node_modules/.bin/browserify js-src/index.js
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mosaic = void 0;
const Tile_1 = require("./Tile");
const Mosaic = (tagAttrs, ...objects) => {
    let tile;
    if (!Array.isArray(tagAttrs)) {
        tile = new Tile_1.Tile(tagAttrs);
    }
    else {
        const match0 = tagAttrs[0].match(/^\s*([a-zA-Z\-_]+)\s*/);
        if (!match0) {
            throw new Error(`Expected a tag name, reading "${tagAttrs.join('')}"[${0}]`);
        }
        let accLength = match0[0].length;
        let tagAttrsIndex = 0;
        const attrs = {};
        const [_0, tag] = match0;
        tile = new Tile_1.Tile(tag);
        let str = tagAttrs[0].slice(match0[0].length);
        if (str.length && str[0] !== '[') {
            throw new Error(`Expected "[", reading "${tagAttrs.join('')}"[${accLength}]`);
        }
        str = str.slice(1);
        accLength++;
        while (str.length) {
            const match1 = str.match(/^\s*([a-zA-Z\-_]+)\s*/);
            if (!match1) {
                throw new Error(`Expected an attribute name, reading "${tagAttrs.join('')}"[${accLength}]`);
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
                throw new Error(`Expected ["=", "]", ";"], reading "${tagAttrs.join('')}"[${accLength}]`);
            }
            str = str.slice(1);
            accLength++;
            const match2 = str.match(/^\s*([a-zA-Z\-_0-9\'\"]+)\s*/);
            if (match2) {
                accLength += match2[0].length;
                const [_2, value] = match2;
                str = str.slice(match2[0].length);
                attrs[attr] = value;
                if (str[0] === ']') {
                    break;
                }
                if (str[0] !== ';') {
                    throw new Error(`Expected ["]", ";"], reading "${tagAttrs.join('')}"[${accLength}]`);
                }
                str = str.slice(1);
                accLength++;
            }
            else {
                attrs[attr] = objects[tagAttrsIndex];
                tagAttrsIndex++;
                str += tagAttrs[tagAttrsIndex];
                const [matchSpaces] = str.match(/^\s*/);
                str = str.slice(matchSpaces.length);
                accLength += matchSpaces.length;
                if (str[0] === ']') {
                    break;
                }
                if (str[0] !== ';') {
                    throw new Error(`Expected ["]", ";"], reading "${tagAttrs.join('')}"[${accLength}]`);
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
            children[0](list => tile.children(list));
            return tile;
        }
        return tile.children(children);
    };
};
exports.Mosaic = Mosaic;

},{"./Tile":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTile = exports.Tile = exports.svgElements = void 0;
exports.svgElements = ['animate', 'animatecolor', 'animatemotion', 'animatetransform', 'set', 'circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'defs', 'glyph', 'g', 'marker', 'mask', 'missing-glyph', 'pattern', 'switch', 'symbol', 'desc', 'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotlight', 'linearGradient', 'radialGradient', 'altGlyph', 'textPath', 'tref', 'tspan'];
class Tile {
    constructor(tag, isText = false) {
        if (typeof tag !== 'string') {
            this.node = tag;
            return;
        }
        this.node = isText ? document.createTextNode(tag)
            : exports.svgElements.includes(tag) ? document.createElementNS('http://www.w3.org/2000/svg', tag)
                : document.createElement(tag);
    }
    attr(key, value) {
        if (this.node instanceof Text)
            return this;
        if (value === undefined) {
            return this.node.getAttribute(key);
        }
        if (value === false) {
            this.node.removeAttribute(key);
        }
        else {
            this.node.setAttribute(key, value);
        }
        return this;
    }
    attrs(keyValues) {
        const node = this.node;
        if (node instanceof Text)
            return this;
        if (keyValues === undefined) {
            return node.getAttributeNames().reduce((acc, key) => {
                acc[key] = node.getAttribute(key);
                return acc;
            }, {});
        }
        Object.keys(keyValues).forEach(key => {
            this.attr(key, keyValues[key]);
        });
        return this;
    }
    text(text) {
        if (text === undefined)
            return this.node.textContent;
        if (this.node instanceof Text) {
            this.node.textContent = text;
        }
        else {
            this.node.appendChild(document.createTextNode(text));
        }
        return this;
    }
    on(eventName, action, useCapture = false) {
        this.node.addEventListener(eventName, action.bind(this.node), useCapture);
        return this;
    }
    tap(f) {
        f(this);
        return this;
    }
    classed(klass, isClassed) {
        if (this.node instanceof Text)
            return this;
        if (klass === undefined) {
            return Array.prototype.slice.call(this.node.classList);
        }
        if (isClassed === undefined && typeof klass === 'string') {
            return this.node.classList.contains(klass);
        }
        if (typeof klass === 'object') {
            Object.keys(klass).forEach(_klass => {
                this.classed(_klass, klass[_klass]);
            });
            return this;
        }
        if (typeof isClassed === 'function') {
            isClassed(_isClassed => this.classed(klass, _isClassed));
            return this;
        }
        this.node.classList[isClassed ? 'add' : 'remove'](klass);
        return this;
    }
    append(tag) {
        const tile = tag instanceof Tile ? tag : new Tile(tag);
        if (this.node.childNodes[this.node.childNodes.length - 1] !== tile.node) {
            this.node.appendChild(tile.node);
        }
        return tile;
    }
    children(children = []) {
        const node = this.node;
        if (node instanceof Text)
            return this;
        let a = Array.prototype.slice.call(node.childNodes);
        const b = children.map(tile => tile.node);
        if (a.length + b.length === 0)
            return this;
        a.filter(element => !b.includes(element)).forEach(element => node.removeChild(element));
        a = Array.prototype.slice.call(node.childNodes);
        let b_i = b.length - 1;
        let b_c;
        while (!a.includes(b[b_i]) && b_i >= 0) {
            b_i--;
        }
        b_c = b_i;
        while (b_i++ < b.length - 1) {
            node.appendChild(b[b_i]);
        }
        for (let b_i = b_c - 1; b_i >= 0; b_i--) {
            if (!a.includes(b[b_i])) {
                node.insertBefore(b[b_i], b[b_i + 1]);
                continue;
            }
            if (a.indexOf(b[b_i]) !== a.indexOf(b[b_c]) - 1) {
                node.insertBefore(b[b_i], b[b_i + 1]);
            }
            b_c = b_i;
        }
        return this;
    }
    adopt(child) {
        this.append(child);
        return this;
    }
    moveToBottom() {
        this.node.parentElement.insertBefore(this.node, this.node.parentElement.children[0]);
        return this;
    }
    moveBelow(sibling) {
        const siblingNode = !sibling
            ? this.node.parentElement.previousElementSibling
            : sibling.node;
        this.node.parentElement.insertBefore(this.node, siblingNode);
        return this;
    }
    moveToTop() {
        this.node.parentElement.appendChild(this.node);
        return this;
    }
    moveAbove(sibling) {
        var _a;
        const siblingNode = !sibling
            ? (_a = this.node.nextElementSibling) === null || _a === void 0 ? void 0 : _a.nextElementSibling
            : sibling.node.nextElementSibling;
        if (!siblingNode) {
            this.node.parentElement.appendChild(this.node);
        }
        else {
            this.node.parentElement.insertBefore(this.node, siblingNode);
        }
        return this;
    }
    remove() {
        this.node.parentElement.removeChild(this.node);
    }
}
exports.Tile = Tile;
const TextTile = text => new Tile(text, true);
exports.TextTile = TextTile;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mosaic = exports.Tile = void 0;
var Tile_1 = require("./Tile");
Object.defineProperty(exports, "Tile", { enumerable: true, get: function () { return Tile_1.Tile; } });
var Mosaic_1 = require("./Mosaic");
Object.defineProperty(exports, "Mosaic", { enumerable: true, get: function () { return Mosaic_1.Mosaic; } });

},{"./Mosaic":1,"./Tile":2}]},{},[3]);
Done in 0.44s.
