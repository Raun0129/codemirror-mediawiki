import { StateField } from '@codemirror/state';
import type { DecorationSet } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import type { MatchResult } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';
declare type TagType = 'ext' | 'html';
declare interface TagMatchResult extends MatchResult {
    start: Tag;
    end?: Tag;
}
declare class Tag {
    readonly type: TagType;
    readonly name: string;
    readonly first: SyntaxNode;
    readonly last: SyntaxNode;
    readonly state: EditorState;
    get closing(): boolean;
    get selfClosing(): boolean;
    get from(): number;
    get to(): number;
    constructor(type: TagType, name: string, first: SyntaxNode, last: SyntaxNode, state: EditorState);
}
/**
 * 获取标签信息，破损的HTML标签会返回`null`
 * @param state
 * @param node 语法树节点
 */
export declare const getTag: (state: EditorState, node: SyntaxNode) => Tag | null;
/**
 * 匹配标签
 * @param state
 * @param pos 位置
 */
export declare const matchTag: (state: EditorState, pos: number) => TagMatchResult | null;
declare const _default: StateField<DecorationSet>;
export default _default;
