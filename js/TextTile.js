"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTile = void 0;
const Tile_1 = require("./Tile");
class TextTile extends Tile_1.Tile {
    constructor(str, ...objects) {
        if (typeof str === 'string') {
            super(document.createTextNode(str));
            return;
        }
        super(document.createTextNode(''));
        const valuesBySubscription = new Map([]);
        const recompute = () => {
            const raw = str.raw;
            this.node.textContent = raw.slice(1).reduce((acc, affix, index) => {
                if (typeof objects[index] === 'function') {
                    const value = valuesBySubscription.has(objects[index])
                        ? valuesBySubscription.get(objects[index])
                        : '';
                    return `${acc}${value}${affix}`;
                }
                else {
                    return `${acc}${objects[index].toString()}${affix}`;
                }
            }, raw[0]);
        };
        objects
            .filter(object => typeof object === 'function')
            .forEach(subscription => {
            subscription(value => {
                valuesBySubscription.set(subscription, value);
                recompute();
            });
        });
    }
    text(text) {
        if (text === undefined)
            return this.node.textContent;
        this.node.textContent = text;
        return this;
    }
}
exports.TextTile = TextTile;
