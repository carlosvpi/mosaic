import { Element, Tag, Tile } from './Tile'

export const SVG_TAGS = ['animate', 'animatecolor', 'animatemotion', 'animatetransform', 'set', 'circle', 'ellipse', 'image', 'line', 'path', 'polygon', 'polyline', 'rect', 'text', 'defs', 'glyph', 'g', 'marker', 'mask', 'missing-glyph', 'pattern', 'switch', 'symbol', 'desc', 'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotlight', 'linearGradient', 'radialGradient', 'altGlyph', 'textPath', 'tref', 'tspan']

export class NodeTile extends Tile {
	node: Element

	constructor (tag: Tag) {
		if (tag instanceof Element) {
			super(tag)
			return
		}
		const node: Element = SVG_TAGS.includes(tag)
			? document.createElementNS('http://www.w3.org/2000/svg', tag)
			: document.createElement(tag)
		super(node)
	}
	attr (key: string, value) {
		if (value === undefined) {
			return this.node.getAttribute(key)
		}
		if (value === false) {
			this.node.removeAttribute(key)
		} else {
			this.node.setAttribute(key, value)
		}
		return this
	}
	attrs (keyValues) {
		const node = this.node
		if (keyValues === undefined) {
			return node.getAttributeNames().reduce((acc, key) => {
				acc[key] = node.getAttribute(key)
				return acc
			}, {})
		}
		Object.keys(keyValues).forEach(key => {
			this.attr(key, keyValues[key])
		})
		return this
	}
	text (text: string | undefined) {
		if (text === undefined) return this.node.textContent
		throw new Error(`Cannot set the text content of a NodeTile. Append a TextTile instead. Trying to set "${text}"`)
	}
	on (eventName: string, action: (evt: Event) => any, useCapture: boolean = false) {
		this.node.addEventListener(eventName, action.bind(this.node), useCapture)
		return this
	}
	classed (klass: string | { [Identifier: string]: boolean | ((a: (k: boolean) => any) => any) } | undefined, isClassed: boolean | ((a: (k: boolean) => any) => any) | undefined) {
		if (klass === undefined) {
			return Array.prototype.slice.call(this.node.classList)
		}
		if (isClassed === undefined && typeof klass === 'string') {
			return this.node.classList.contains(klass)
		}
		if (typeof klass === 'object') {
			Object.keys(klass).forEach(_klass => {
				this.classed(_klass, klass[_klass])
			})
			return this
		}
		if (typeof isClassed === 'function') {
			isClassed(_isClassed => this.classed(klass, _isClassed))
			return this
		}
		this.node.classList[isClassed ? 'add' : 'remove'](klass)
		return this
	}
	append (tag: Tag) {
		const tile = tag instanceof Tile ? tag : new Tile(tag)
		if (this.node.childNodes[this.node.childNodes.length - 1] !== tile.node) {
			this.node.appendChild(tile.node)
		}
		return tile
	}
	children (children: Tile[] = [], childrenToRemove: Tile[] = []) {
		const node = this.node
		childrenToRemove.forEach(childToRemove => this._removingChildren.add(childToRemove))
		children.filter(child => !childrenToRemove.includes(child)).forEach(child => {
			if (!this._removingChildren.has(child)) return
			this._removingChildren.delete(child)
			child._onCancelExit(this)
		})
		let a = Array.prototype.slice.call(node.childNodes)
		const b = children.map(tile => tile.node)
		const childrenByNode = new Map(children.map(child => [child.node, child]))
		if (a.length + b.length === 0) return this
		a.filter(element => !b.includes(element)).forEach(element => node.removeChild(element))
		a = Array.prototype.slice.call(node.childNodes)
		let b_i = b.length - 1
		let b_c
		while (!a.includes(b[b_i]) && b_i >= 0) {
			b_i--
		}
		b_c = b_i
		while (b_i++ < b.length - 1) {
			const ch = childrenByNode.get(b[b_i])
			if (childrenToRemove.includes(ch)) continue
			node.appendChild(b[b_i])
			ch._onEnter(ch)
		}

		for (let b_i = b_c - 1; b_i >= 0; b_i--) {
			if (!a.includes(b[b_i])) {
				const ch = childrenByNode.get(b[b_i])
				if (childrenToRemove.includes(ch)) continue
				node.insertBefore(b[b_i], b[b_i + 1])
				ch._onEnter(ch)
				continue
			}
			if (a.indexOf(b[b_i]) !== a.indexOf(b[b_c]) - 1) {
				node.insertBefore(b[b_i], b[b_i + 1])
			}

			b_c = b_i
		}
		childrenToRemove.forEach(async (childToRemove) => {
			if (!Array.from(this.node.childNodes).includes(childToRemove.node)) return
			const onExit = childToRemove._onExit(childToRemove)
			if (!(onExit instanceof Promise)) throw new Error('onExit must return a promise')
			await onExit
			if (!Array.from(this.node.childNodes).includes(childToRemove.node)) return
			if (!this._removingChildren.has(childToRemove)) return
			this._removingChildren.delete(childToRemove)
			node.removeChild(childToRemove.node)
		})
		return this
	}
	adopt (child: Tag) {
		this.append(child)
		return this
	}
}