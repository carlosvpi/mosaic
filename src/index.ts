import { TextTile } from './TextTile'
import { NodeTile } from './NodeTile'
// @ts-ignore
module.exports = require('./Mosaic')
// @ts-ignore
module.exports.NodeTile = NodeTile
// @ts-ignore
module.exports.TextTile = (...args) => new TextTile(...args)
