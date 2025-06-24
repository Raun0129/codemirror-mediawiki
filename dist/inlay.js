import { StateField, StateEffect } from '@codemirror/state';
import { Decoration, EditorView, WidgetType, ViewPlugin } from '@codemirror/view';
import { getLSP } from '@bhsd/common';
import { posToIndex } from './hover';
class InlayHintWidget extends WidgetType {
    constructor(label) {
        super();
        this.label = label;
    }
    toDOM() {
        const element = document.createElement('span');
        element.textContent = this.label;
        element.className = 'cm-inlay-hint';
        return element;
    }
}
const stateEffect = StateEffect.define(), field = StateField.define({
    create() {
        return Decoration.none;
    },
    update(deco, { state: { doc }, effects }) {
        const str = doc.toString();
        for (const effect of effects) {
            if (effect.is(stateEffect)) {
                const { value: { text, inlayHints } } = effect;
                if (str === text) {
                    return inlayHints
                        ? Decoration.set(inlayHints.reverse()
                            .map(({ position, label }) => [posToIndex(doc, position), label])
                            .sort(([a], [b]) => a - b)
                            .map(([index, label]) => Decoration.widget({ widget: new InlayHintWidget(label) }).range(index)))
                        : Decoration.none;
                }
            }
        }
        return deco;
    },
    provide(f) {
        return EditorView.decorations.from(f);
    },
});
const updateField = async ({ view, docChanged }) => {
    if (docChanged) {
        const text = view.state.doc.toString();
        view.dispatch({
            effects: stateEffect.of({
                text,
                inlayHints: await getLSP(view)?.['provideInlayHints'](text),
            }),
        });
    }
};
export default (cm) => [
    field,
    ViewPlugin.fromClass(class {
        constructor(view) {
            const timer = setInterval(() => {
                if (getLSP(view, false, cm.getWikiConfig)) {
                    clearInterval(timer);
                    void updateField({ view, docChanged: true });
                }
            }, 100);
        }
        update(update) {
            void updateField(update);
        }
    }),
];
