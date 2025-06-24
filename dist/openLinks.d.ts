import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import type { CodeMirror6 } from './codemirror';
import type { MwConfig } from './token';
export declare const isMac: boolean;
export declare const mouseEventListener: (e: MouseEvent, view: EditorView, langConfig: MwConfig | undefined) => string | undefined;
declare const _default: ({ langConfig }: CodeMirror6) => Extension;
export default _default;
