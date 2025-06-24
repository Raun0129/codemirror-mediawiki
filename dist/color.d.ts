import type { Text, Extension } from '@codemirror/state';
import type { Tree } from '@lezer/common';
import type { StyleSpec } from 'style-mod';
import type { WidgetOptions } from '@bhsd/codemirror-css-color-picker';
export declare const discoverColors: (_: Tree, from: number, to: number, type: string, doc: Text) => WidgetOptions[] | null;
declare const _default: [([e, style]?: [Extension?, StyleSpec?]) => Extension, {
    css: [Extension];
    mediawiki: [Extension[], {
        marginLeft: string;
    }];
}];
export default _default;
