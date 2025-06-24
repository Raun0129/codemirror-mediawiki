import type { Diagnostic as DiagnosticBase, Range } from 'vscode-languageserver-types';
import type { Linter } from 'eslint';
import type { Warning } from 'stylelint';
import type { Diagnostic } from 'luacheck-browserify';
export type Option = Record<string, unknown> | null | undefined;
export type LiveOption = (runtime?: boolean) => Option;
declare type getLinter<T> = () => (text: string) => T;
declare type asyncLinter<T, S = Record<string, unknown>> = ((text: string, config?: Option) => T) & {
    config?: S;
    fixer?: (code: string, rule?: string) => string | Promise<string>;
};
/**
 * @param opt 初始化选项
 * @param obj 仅用于wikiparse.LanguageService
 */
declare type getAsyncLinter<T, S = never, R = never> = (opt?: S, obj?: R) => Promise<asyncLinter<T>>;
declare interface MixedDiagnostic extends Omit<DiagnosticBase, 'range'> {
    range?: Range;
    from?: number;
    to?: number;
}
declare interface JsonError {
    message: string;
    severity: 'error';
    line: string | undefined;
    column: string | undefined;
    position: string | undefined;
}
/**
 * 获取 Wikitext LSP
 * @param opt 选项
 * @param obj 对象
 */
export declare const getWikiLinter: getAsyncLinter<Promise<MixedDiagnostic[]>, Option, object>;
export declare const jsConfig: Linter.Config<Linter.RulesRecord, Linter.RulesRecord>;
/** 获取 ESLint */
export declare const getJsLinter: getAsyncLinter<Linter.LintMessage[]>;
/** 获取 Stylelint */
export declare const getCssLinter: getAsyncLinter<Promise<Warning[]>>;
/** 获取 Luacheck */
export declare const getLuaLinter: getAsyncLinter<Promise<Diagnostic[]>>;
/** JSON.parse */
export declare const getJsonLinter: getLinter<JsonError[]>;
export {};
