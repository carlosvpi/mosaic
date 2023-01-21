"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Tile = exports.svgElements = void 0;
exports.svgElements = ['animate', 'animatecolor', 'animatemotion', 'animatetransform', 'set', 'circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'defs', 'glyph', 'g', 'marker', 'mask', 'missing-glyph', 'pattern', 'switch', 'symbol', 'desc', 'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotlight', 'linearGradient', 'radialGradient', 'altGlyph', 'textPath', 'tref', 'tspan'];
var Tile = /** @class */ (function () {
    function Tile(tag, isText) {
        if (isText === void 0) { isText = false; }
        if (typeof tag !== 'string') {
            this.node = tag;
            return;
        }
        this.node = isText ? document.createTextNode(tag)
            : exports.svgElements.includes(tag) ? document.createElementNS('http://www.w3.org/2000/svg', tag)
                : document.createElement(tag);
    }
    Tile.prototype.attr = function (key, value) {
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
    };
    Tile.prototype.attrs = function (keyValues) {
        var _this = this;
        if (keyValues === undefined) {
            return this.node.getAttributeNames().reduce(function (acc, key) {
                acc[key] = _this.node.getAttribute(key);
                return acc;
            }, {});
        }
        Object.keys(keyValues).forEach(function (key) {
            _this.attr(key, keyValues[key]);
        });
        return this;
    };
    Tile.prototype.text = function (text) {
        this.node.appendChild(document.createTextNode(text));
        return this;
    };
    Tile.prototype.on = function (eventName, action, useCapture) {
        this.node.addEventListener(eventName, action.bind(this.node), useCapture);
        return this;
    };
    Tile.prototype.tap = function (f) {
        f(this);
        return this;
    };
    Tile.prototype.classed = function (klass, isClassed) {
        if (klass === undefined) {
            return __spreadArray([], this.classList, true);
        }
        if (isClassed === undefined) {
            return this.node.classList.contains(klass);
        }
        this.node.classList[isClassed ? 'add' : 'remove'](klass);
        return this;
    };
    Tile.prototype.append = function (tag) {
        var tile = tag instanceof Tile ? tag : new Tile(tag);
        if (this.node.childNodes[this.node.childNodes.length - 1] !== tile.node) {
            this.node.appendChild(tile.node);
        }
        return tile;
    };
    Tile.prototype.children = function (children) {
        var _this = this;
        if (children === void 0) { children = []; }
        var a = __spreadArray([], this.node.childNodes, true);
        var b = children.map(function (tile) { return tile.node; });
        if (a.length + b.length === 0)
            return this;
        a.filter(function (element) { return !b.includes(element); }).forEach(function (element) { return _this.node.removeChild(element); });
        a = __spreadArray([], this.node.childNodes, true);
        var b_i = b.length - 1;
        var b_c;
        while (!a.includes(b[b_i]) && b_i >= 0) {
            b_i--;
        }
        b_c = b_i;
        while (b_i++ < b.length - 1) {
            this.node.appendChild(b[b_i]);
        }
        for (var b_i_1 = b_c - 1; b_i_1 >= 0; b_i_1--) {
            if (!a.includes(b[b_i_1])) {
                this.node.insertBefore(b[b_i_1], b[b_i_1 + 1]);
                continue;
            }
            if (a.indexOf(b[b_i_1]) !== a.indexOf(b[b_c]) - 1) {
                this.node.insertBefore(b[b_i_1], b[b_i_1 + 1]);
            }
            b_c = b_i_1;
        }
        return this;
    };
    Tile.prototype.adopt = function (child) {
        this.append(child);
        return this;
    };
    Tile.prototype.moveToBottom = function () {
        this.node.parentElement.insertBefore(this.node, this.node.parentElement.chidlren[0]);
        return this;
    };
    Tile.prototype.moveBelow = function (sibling) {
        var siblingNode = !sibling
            ? this.node.parentElement.previousElementSibling
            : sibling.node;
        this.node.parentElement.insertBefore(this.node, siblingNode);
        return this;
    };
    Tile.prototype.moveToTop = function () {
        this.node.parentElement.appendChild(this.node);
        return this;
    };
    Tile.prototype.moveAbove = function (sibling) {
        var _a;
        var siblingNode = !sibling
            ? (_a = this.node.nextElementSibling) === null || _a === void 0 ? void 0 : _a.nextElementSibling
            : sibling.node.nextElementSibling;
        if (!siblingNode) {
            this.node.parentElement.appendChild(this.node);
        }
        else {
            this.node.parentElement.insertBefore(this.node, siblingNode);
        }
        return this;
    };
    Tile.prototype.remove = function () {
        this.node.parentElement.removeChild(this.node);
    };
    return Tile;
}());
exports.Tile = Tile;
Tile.text = function (text) { return new Tile(text, true); };
