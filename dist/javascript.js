import { javascript as js, javascriptLanguage, scopeCompletionSource } from '@codemirror/lang-javascript';
export default () => [
    js(),
    javascriptLanguage.data.of({ autocomplete: scopeCompletionSource(globalThis) }),
];
