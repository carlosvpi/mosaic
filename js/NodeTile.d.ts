import { Element, Tag, Tile } from './Tile';
export declare const SVG_TAGS: string[];
export declare class NodeTile extends Tile {
    node: Element;
    constructor(tag: Tag);
    attr(key: string, value: any): string | this;
    attrs(keyValues: any): {};
    text(text: string | undefined): string;
    on(eventName: string, action: (evt: Event) => any, useCapture?: boolean): this;
    classed(klass: string | {
        [Identifier: string]: boolean | ((a: (k: boolean) => any) => any);
    } | undefined, isClassed: boolean | ((a: (k: boolean) => any) => any) | undefined): any;
    append(tag: Tag): Tile;
    children(children?: Tile[], childrenToRemove?: Tile[]): this;
    adopt(child: Tag): this;
}
