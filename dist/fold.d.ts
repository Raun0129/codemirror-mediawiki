import { StateField } from '@codemirror/state';
import type { EditorView, Tooltip } from '@codemirror/view';
import type { EditorState, Extension } from '@codemirror/state';
import type { SyntaxNode, Tree } from '@lezer/common';
export interface DocRange {
    from: number;
    to: number;
}
/**
 * Update the stack of opening (+) or closing (-) brackets
 * @param state
 * @param node 语法树节点
 */
export declare const braceStackUpdate: (state: EditorState, node: SyntaxNode) => [number, number];
/**
 * 寻找可折叠的范围
 * @param state
 * @param posOrNode 字符位置或语法树节点
 * @param tree 语法树
 */
export declare const foldable: (state: EditorState, posOrNode: number | SyntaxNode, tree?: Tree | null) => DocRange | false;
export declare const foldableLine: ({ state, viewport: { to: end }, viewportLineBlocks }: EditorView, { from: f, to: t }: DocRange) => DocRange | false;
declare const _default: [(e?: Extension | undefined) => Extension, {
    mediawiki: (Extension | StateField<Tooltip | null>)[];
}];
export default _default;
/**
 * 点击提示折叠模板参数
 * @param view
 */
export declare const foldHandler: (view: EditorView) => (e: MouseEvent) => void;
