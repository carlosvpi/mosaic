import { Tile } from './Tile';
export declare class TextTile extends Tile {
    node: Text;
    constructor(str: TemplateStringsArray | string, ...objects: any[]);
    text(text: string | undefined): string | this;
}
