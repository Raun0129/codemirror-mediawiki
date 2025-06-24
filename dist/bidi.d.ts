/**
 * @author MusikAnimal
 * @license GPL-2.0-or-later
 * @see https://gerrit.wikimedia.org/g/mediawiki/extensions/CodeMirror
 */
import { EditorView, Direction, ViewPlugin } from '@codemirror/view';
import type { ViewUpdate, DecorationSet } from '@codemirror/view';
export declare const computeIsolates: ({ visibleRanges, state, textDirection }: EditorView) => DecorationSet;
declare const _default: ViewPlugin<{
    isolates: DecorationSet;
    tree: import("@lezer/common").Tree;
    dir: Direction;
    update({ docChanged, viewportChanged, state, view }: ViewUpdate): void;
}, undefined>;
export default _default;
