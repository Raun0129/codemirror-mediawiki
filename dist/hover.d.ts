import type { TooltipView, EditorView } from '@codemirror/view';
import type { Text, Extension } from '@codemirror/state';
import type { Position } from 'vscode-languageserver-types';
import type { CodeMirror6 } from './codemirror';
/**
 * 将索引转换为位置
 * @param doc Text 实例
 * @param index 索引
 */
export declare const indexToPos: (doc: Text, index: number) => Position;
/**
 * 将位置转换为索引
 * @param doc Text 实例
 * @param pos 位置
 */
export declare const posToIndex: (doc: Text, pos: Position) => number;
/**
 * 创建 TooltipView
 * @param view EditorView 实例
 * @param innerHTML 提示内容
 */
export declare const createTooltipView: (view: EditorView, innerHTML: string) => TooltipView;
declare const _default: (cm: CodeMirror6) => Extension;
export default _default;
