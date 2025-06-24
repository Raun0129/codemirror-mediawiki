/* eslint-disable unicorn/no-unreadable-iife */
import { loadScript, getWikiparse, getLSP, sanitizeInlineStyle } from '@bhsd/common';
import { styleLint } from '@bhsd/common/dist/stylelint';
/**
 * 计算位置
 * @param range 范围
 * @param line 行号
 * @param column 列号
 */
const offsetAt = (range, line, column) => {
    if (line === -2) {
        return range[0];
    }
    return line === 0 ? range[1] : range[0] + column;
};
/**
 * 获取 Wikitext LSP
 * @param opt 选项
 * @param obj 对象
 */
export const getWikiLinter = async (opt, obj) => {
    await getWikiparse(opt?.['getConfig'], opt?.['i18n']);
    const lsp = getLSP(obj, opt?.['include']);
    return async (text, config) => {
        const diagnostics = (await lsp['provideDiagnostics'](text)).filter(({ code, severity }) => Number(config?.[code] ?? 2) > Number(severity === 2)), tokens = 'findStyleTokens' in lsp && config?.['invalid-css'] !== '0' ? await lsp.findStyleTokens() : [];
        if (tokens.length === 0) {
            return diagnostics;
        }
        const cssLint = await getCssLinter();
        return [
            ...diagnostics,
            ...(await cssLint(tokens.map(({ childNodes, type, tag }, i) => `${type === 'ext-attr' ? 'div' : tag}#${i}{\n${sanitizeInlineStyle(childNodes[1].childNodes[0].data)
                .replace(/\n/gu, ' ')}\n}`).join('\n'))).map(({ line, column, endLine, endColumn, rule, severity, text: message }) => {
                const i = Math.ceil(line / 3), { range } = tokens[i - 1].childNodes[1].childNodes[0], from = offsetAt(range, line - 3 * i, column - 1);
                return {
                    from,
                    to: endLine === undefined ? from : offsetAt(range, endLine - 3 * i, endColumn - 1),
                    severity: severity === 'error' ? 1 : 2,
                    source: 'Stylelint',
                    code: rule,
                    message,
                };
            }),
        ];
    };
};
export const jsConfig = /* #__PURE__ */ (() => ({
    env: { browser: true, es2024: true, jquery: true },
    globals: {
        mw: 'readonly',
        mediaWiki: 'readonly',
        OO: 'readonly',
        addOnloadHook: 'readonly',
        importScriptURI: 'readonly',
        importScript: 'readonly',
        importStylesheet: 'readonly',
        importStylesheetURI: 'readonly',
    },
}))();
/** 获取 ESLint */
export const getJsLinter = async () => {
    await loadScript('npm/@bhsd/eslint-browserify', 'eslint');
    /** @see https://www.npmjs.com/package/@codemirror/lang-javascript */
    const esLinter = new eslint.Linter(), conf = {
        env: { browser: true, es2024: true },
        parserOptions: { ecmaVersion: 15, sourceType: 'module' },
    }, recommended = {};
    for (const [name, { meta }] of esLinter.getRules()) {
        if (meta?.docs?.recommended) {
            recommended[name] = 2;
        }
    }
    const linter = (text, opt) => {
        const config = { ...conf, ...opt };
        if (!('rules' in config)
            || config.extends === 'eslint:recommended'
            || Array.isArray(config.extends) && config.extends.includes('eslint:recommended')) {
            config.rules = { ...recommended, ...config.rules };
        }
        delete config.extends;
        linter.config = config;
        return esLinter.verify(text, config);
    };
    linter.fixer = (code, rule) => esLinter.verifyAndFix(code, rule ? { ...linter.config, rules: { [rule]: linter.config.rules?.[rule] ?? 2 } } : linter.config).output;
    return linter;
};
/** 获取 Stylelint */
export const getCssLinter = async () => {
    await loadScript('npm/@bhsd/stylelint-browserify', 'stylelint');
    const linter = async (code, opt) => {
        const warnings = await styleLint(stylelint, code, opt);
        if (opt && 'rules' in opt) {
            linter.config = opt;
        }
        return warnings;
    };
    linter.fixer = (code, rule) => {
        if (!linter.config) {
            throw new Error('Fixer unavailable!');
        }
        return styleLint(stylelint, code, rule ? { extends: [], rules: { [rule]: linter.config.rules?.[rule] ?? true } } : linter.config, true);
    };
    return linter;
};
/** 获取 Luacheck */
export const getLuaLinter = async () => {
    await loadScript('npm/luacheck-browserify', 'luacheck');
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const luachecker = await luacheck(undefined);
    return async (text) => (await luachecker.queue(text)).filter(({ severity }) => severity);
};
/** JSON.parse */
export const getJsonLinter = () => str => {
    try {
        if (str.trim()) {
            JSON.parse(str);
        }
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            const { message } = e, line = /\bline (\d+)/u.exec(message)?.[1], column = /\bcolumn (\d+)/u.exec(message)?.[1], position = /\bposition (\d+)/u.exec(message)?.[1];
            return [
                {
                    message,
                    severity: 'error',
                    line,
                    column,
                    position,
                },
            ];
        }
    }
    return [];
};
