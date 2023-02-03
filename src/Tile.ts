export type Element = HTMLElement | SVGElement
export type Node = Element | Text
export type Tag = Element | string

export class Tile {
	node: Node
	_onEnter: (tile: Tile) => any
	_onExit: (tile: Tile) => Promise<any>
	_onCancelExit: (tile: Tile) => any
	_removingChildren: Set<Tile>

	constructor (node) {
		this._onEnter = () => {}
		this._onExit = () => Promise.resolve()
		this._onCancelExit = () => {}
		this._removingChildren = new Set([])
		this.node = node
	}
	tap (f: (tile: Tile) => any) {
		f(this)
		return this
	}
	moveToBottom () {
		this.node.parentElement.insertBefore(this.node, this.node.parentElement.children[0])
		return this
	}
	moveBelow (sibling: Tile) {
		const siblingNode = !sibling
			? this.node.parentElement.previousElementSibling
			: sibling.node
		this.node.parentElement.insertBefore(this.node, siblingNode)
		return this
	}
	moveToTop () {
		this.node.parentElement.appendChild(this.node)
		return this
	}
	moveAbove (sibling: Tile) {
		const siblingNode = !sibling
			? this.node.nextElementSibling?.nextElementSibling
			: sibling.node.nextElementSibling
		if (!siblingNode) {
			this.node.parentElement.appendChild(this.node)
		} else {
			this.node.parentElement.insertBefore(this.node, siblingNode)
		}
		return this
	}
	remove () {
		this.node.parentElement.removeChild(this.node)
	}
	onEnter (_onEnter) {
		if (!(_onEnter instanceof Function)) throw new Error('onEnter must receive a function')
		this._onEnter = _onEnter.bind(this)
		return this
	}
	onExit (_onExit) {
		if (!(_onExit instanceof Function)) throw new Error('onExit must receive a function')
		this._onExit = _onExit.bind(this)
		return this
	}
	onCancelExit (_onCancelExit) {
		if (!(_onCancelExit instanceof Function)) throw new Error('onCancelExit must receive a function')
		this._onCancelExit = _onCancelExit.bind(this)
		return this
	}
}
