"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTile = exports.Tile = exports.svgElements = void 0;
exports.svgElements = ['animate', 'animatecolor', 'animatemotion', 'animatetransform', 'set', 'circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'defs', 'glyph', 'g', 'marker', 'mask', 'missing-glyph', 'pattern', 'switch', 'symbol', 'desc', 'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotlight', 'linearGradient', 'radialGradient', 'altGlyph', 'textPath', 'tref', 'tspan'];
class Tile {
    constructor(tag, isText = false) {
        this._onEnter = () => { };
        this._onExit = () => Promise.resolve();
        this._onCancelExit = () => { };
        this._removingChildren = new Set([]);
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
    children(children = [], childrenToRemove = []) {
        const node = this.node;
        childrenToRemove.forEach(childToRemove => this._removingChildren.add(childToRemove));
        children.filter(child => !childrenToRemove.includes(child)).forEach(child => {
            if (!this._removingChildren.has(child))
                return;
            this._removingChildren.delete(child);
            child._onCancelExit(this);
        });
        if (node instanceof Text)
            return this;
        let a = Array.prototype.slice.call(node.childNodes);
        const b = children.map(tile => tile.node);
        const childrenByNode = new Map(children.map(child => [child.node, child]));
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
            const ch = childrenByNode.get(b[b_i]);
            if (childrenToRemove.includes(ch))
                continue;
            node.appendChild(b[b_i]);
            ch._onEnter(ch);
        }
        for (let b_i = b_c - 1; b_i >= 0; b_i--) {
            if (!a.includes(b[b_i])) {
                const ch = childrenByNode.get(b[b_i]);
                if (childrenToRemove.includes(ch))
                    continue;
                node.insertBefore(b[b_i], b[b_i + 1]);
                ch._onEnter(ch);
                continue;
            }
            if (a.indexOf(b[b_i]) !== a.indexOf(b[b_c]) - 1) {
                node.insertBefore(b[b_i], b[b_i + 1]);
            }
            b_c = b_i;
        }
        childrenToRemove.forEach((childToRemove) => __awaiter(this, void 0, void 0, function* () {
            if (!Array.from(this.node.childNodes).includes(childToRemove.node))
                return;
            const onExit = childToRemove._onExit(childToRemove);
            if (!(onExit instanceof Promise))
                throw new Error('onExit must return a promise');
            yield onExit;
            if (!Array.from(this.node.childNodes).includes(childToRemove.node))
                return;
            if (!this._removingChildren.has(childToRemove))
                return;
            this._removingChildren.delete(childToRemove);
            node.removeChild(childToRemove.node);
        }));
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
    onEnter(_onEnter) {
        if (!(_onEnter instanceof Function))
            throw new Error('onEnter must receive a function');
        this._onEnter = _onEnter.bind(this);
        return this;
    }
    onExit(_onExit) {
        if (!(_onExit instanceof Function))
            throw new Error('onExit must receive a function');
        this._onExit = _onExit.bind(this);
        return this;
    }
    onCancelExit(_onCancelExit) {
        if (!(_onCancelExit instanceof Function))
            throw new Error('onCancelExit must receive a function');
        this._onCancelExit = _onCancelExit.bind(this);
        return this;
    }
}
exports.Tile = Tile;
const TextTile = text => new Tile(text, true);
exports.TextTile = TextTile;
