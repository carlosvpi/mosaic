import { Tile } from './Tile'

export class TextTile extends Tile {
	node: Text

	constructor (str: TemplateStringsArray | string, ...objects) {
		if (typeof str === 'string') {
			super(document.createTextNode(str))
			return
		}
		super(document.createTextNode(''))
		const valuesBySubscription = new Map([])
		const recompute = () => {
			const raw = str.raw
			this.node.textContent = raw.slice(1).reduce((acc, affix, index) => {
				if (typeof objects[index] === 'function') {
					const value = valuesBySubscription.has(objects[index])
						? valuesBySubscription.get(objects[index])
						: ''
					return `${acc}${value}${affix}`
				} else {
					return `${acc}${objects[index].toString()}${affix}`
				}
			}, raw[0])
		}
		objects
			.filter(object => typeof object === 'function')
			.forEach(subscription => {
				subscription(value => {
					valuesBySubscription.set(subscription, value)
					recompute()
				})
			})
	}
	text (text: string | undefined) {
		if (text === undefined) return this.node.textContent
		this.node.textContent = text
		return this
	}
}
