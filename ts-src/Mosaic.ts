import { Tile, Tag } from './Tile'

export const Mosaic = (tagAttrs: string[] | Tag, ...objects) => {
	let tile: Tile
	if (!Array.isArray(tagAttrs)) {
		tile = new Tile(tagAttrs)
	} else {
		const match0 = tagAttrs[0].match(/^\s*([a-zA-Z\-_]+)\s*/)
		if (!match0) {
			throw new Error(`Expected a tag name, reading "${tagAttrs.join('')}"[${0}]`)
		}
		let accLength = match0[0].length
		let tagAttrsIndex = 0
		const attrs = {}
		const [_0, tag] = match0
		tile = new Tile(tag)
		let str = tagAttrs[0].slice(match0[0].length)
		if (str.length && str[0] !== '[') {
			throw new Error(`Expected "[", reading "${tagAttrs.join('')}"[${accLength}]`)
		}
		str = str.slice(1)
		accLength++

		while (str.length) {
			const match1 = str.match(/^\s*([a-zA-Z\-_]+)\s*/)
			if (!match1) {
				throw new Error(`Expected an attribute name, reading "${tagAttrs.join('')}"[${accLength}]`)
			}
			accLength += match1[0].length
			const [_1, attr] = match1
			str = str.slice(match1[0].length)
			if (str[0] === ']') {
				attrs[attr] = true
				break
			}
			if (str[0] === ';') {
				attrs[attr] = true
				str = str.slice(1)
				continue
			}
			if (str[0] !== '=') {
				throw new Error(`Expected ["=", "]", ";"], reading "${tagAttrs.join('')}"[${accLength}]`)
			}
			str = str.slice(1)
			accLength++
			const match2 = str.match(/^\s*([a-zA-Z\-_0-9\'\"]+)\s*/)
			if (match2) {
				accLength += match2[0].length
				const [_2, value] = match2
				str = str.slice(match2[0].length)
				attrs[attr] = value
				if (str[0] === ']') {
					break
				}
				if (str[0] !== ';') {
					throw new Error(`Expected ["]", ";"], reading "${tagAttrs.join('')}"[${accLength}]`)
				}
				str = str.slice(1)
				accLength++
			} else {
				attrs[attr] = objects[tagAttrsIndex]
				tagAttrsIndex++
				str += tagAttrs[tagAttrsIndex]
				const [matchSpaces] = str.match(/^\s*/)
				str = str.slice(matchSpaces.length)
				accLength += matchSpaces.length
				if (str[0] === ']') {
					break
				}
				if (str[0] !== ';') {
					throw new Error(`Expected ["]", ";"], reading "${tagAttrs.join('')}"[${accLength}]`)
				}
				str = str.slice(1)
				accLength++
			}
		}
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
			children[0](list => tile.children(list))
			return tile
		}
		return tile.children(children)
	}
}