"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextTile_1 = require("./TextTile");
const NodeTile_1 = require("./NodeTile");
// @ts-ignore
module.exports = require('./Mosaic');
// @ts-ignore
module.exports.NodeTile = NodeTile_1.NodeTile;
// @ts-ignore
module.exports.TextTile = (...args) => new TextTile_1.TextTile(...args);
