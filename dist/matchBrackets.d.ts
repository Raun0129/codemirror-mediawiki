import type { Extension, EditorState } from '@codemirror/state';
import type { Config, MatchResult } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';
export declare const findEnclosingBrackets: (node: SyntaxNode, pos: number, brackets: string) => MatchResult | undefined;
export declare const findEnclosingPlainBrackets: (state: EditorState, pos: number, config: Required<Config>) => MatchResult | null;
declare const _default: (configs: Config) => Extension;
export default _default;
