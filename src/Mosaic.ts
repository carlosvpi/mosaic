import { Element } from './Tile'
import { NodeTile } from './NodeTile'
import { getAttrsFromTemplate, memoize } from './util'

const Mosaic = (tagAttrs: Function | TemplateStringsArray | Element, ...objects) => {
	if (tagAttrs instanceof Function) {
		const defaults = objects[0]
		return memoize((template, ...args) => {
			const attrs = getAttrsFromTemplate(undefined, template, ...args)
			const props = { ...defaults, ...attrs }
			return tagAttrs(props)
		})
	}
	let tile: NodeTile
	if (tagAttrs instanceof Element) {
		tile = new NodeTile(tagAttrs)
	} else {
		const [first, ...rawTagAttrs] = tagAttrs.raw
		const match0 = first.match(/^\s*([a-zA-Z_][a-zA-Z\-_0-9]*)\s*/)
		if (!match0) {
			throw new Error(`Expected a tag name, reading "${rawTagAttrs.join('')}"[0]`)
		}
		const str = first.slice(match0[0].length)
		if (str.length && str[0] !== '[') {
			throw new Error(`Expected "[", reading "${rawTagAttrs.join('')}"[${match0[0].length}]`)
		}
		const attrs = getAttrsFromTemplate(']', [str.slice(1), ...rawTagAttrs], ...objects)
		tile = new NodeTile(match0[1])
		Object.keys(attrs).forEach(attrKey => {
			if (typeof attrs[attrKey] === 'function') {
				attrs[attrKey](value => tile.attr(attrKey, value))
			} else {
				tile.attr(attrKey, attrs[attrKey])
			}
		})
	}
	return (...children) => {
		if (typeof children[0] === 'function') {
			children[0](list => {
				tile.children(list.map(([child, _]) => child), candidateChild => list.find(([child]) => candidateChild === child)[1])
			})
			return tile
		}
		return tile.children(children, () => true)
	}
}

// @ts-ignore
module.exports = Mosaic
