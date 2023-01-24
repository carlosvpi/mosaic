export declare const svgElements: string[];
export type Node = HTMLElement | Text | SVGElement;
export type Tag = string | Node;
export declare class Tile {
    node: Node;
    _onEnter: (tile: Tile) => any;
    _onExit: (tile: Tile) => Promise<any>;
    _onCancelExit: (tile: Tile) => any;
    _removingChildren: Set<Tile>;
    constructor(tag: Tag, isText?: boolean);
    attr(key: string, value: any): string | this;
    attrs(keyValues: any): {};
    text(text: string | undefined): string | this;
    on(eventName: string, action: (evt: Event) => any, useCapture?: boolean): this;
    tap(f: (tile: Tile) => any): this;
    classed(klass: string | {
        [Identifier: string]: boolean | ((a: (k: boolean) => any) => any);
    } | undefined, isClassed: boolean | ((a: (k: boolean) => any) => any) | undefined): any;
    append(tag: Tag): any;
    children(children?: Tile[], childrenToRemove?: Tile[]): this;
    adopt(child: Tag): this;
    moveToBottom(): this;
    moveBelow(sibling: Tile): this;
    moveToTop(): this;
    moveAbove(sibling: Tile): this;
    remove(): void;
    onEnter(_onEnter: any): this;
    onExit(_onExit: any): this;
    onCancelExit(_onCancelExit: any): this;
}
export declare const TextTile: (text: any) => Tile;
