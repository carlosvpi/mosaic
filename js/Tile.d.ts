export type Element = HTMLElement | SVGElement;
export type Node = Element | Text;
export type Tag = Element | string;
export declare class Tile {
    node: Node;
    _onEnter: (tile: Tile) => any;
    _onExit: (tile: Tile) => Promise<any>;
    _onCancelExit: (tile: Tile) => any;
    _removingChildren: Set<Tile>;
    constructor(node: any);
    tap(f: (tile: Tile) => any): this;
    moveToBottom(): this;
    moveBelow(sibling: Tile): this;
    moveToTop(): this;
    moveAbove(sibling: Tile): this;
    remove(): void;
    onEnter(_onEnter: any): this;
    onExit(_onExit: any): this;
    onCancelExit(_onCancelExit: any): this;
}
