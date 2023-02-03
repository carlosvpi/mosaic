"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
class Tile {
    constructor(node) {
        this._onEnter = () => { };
        this._onExit = () => Promise.resolve();
        this._onCancelExit = () => { };
        this._removingChildren = new Set([]);
        this.node = node;
    }
    tap(f) {
        f(this);
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
