import { cssLanguage, cssCompletionSource } from '@codemirror/lang-css';
import { LanguageSupport, syntaxTree } from '@codemirror/language';
export default (dialect) => new LanguageSupport(cssLanguage, cssLanguage.data.of({
    autocomplete(context) {
        const { state, pos } = context, node = syntaxTree(state).resolveInner(pos, -1), result = cssCompletionSource(context);
        if (result) {
            if (node.name === 'ValueName') {
                const options = [{ label: 'revert', type: 'keyword' }, ...result.options];
                let { prevSibling } = node;
                while (prevSibling && prevSibling.name !== 'PropertyName') {
                    ({ prevSibling } = prevSibling);
                }
                if (prevSibling) {
                    for (let i = 0; i < options.length; i++) {
                        const option = options[i];
                        if (CSS.supports(state.sliceDoc(prevSibling.from, node.from) + option.label)) {
                            options.splice(i, 1, { ...option, boost: 50 });
                        }
                    }
                }
                result.options = options;
            }
            else if (dialect === 'sanitized-css') {
                result.options = result.options.filter(({ type, label }) => type !== 'property'
                    || !label.startsWith('-') || label.endsWith('-user-select'));
            }
        }
        return result;
    },
}));
