import { EditorView } from '@codemirror/view';
import type { KeyBinding } from '@codemirror/view';
import type { Extension, Text } from '@codemirror/state';
import type { SyntaxNode } from '@lezer/common';
import type { Diagnostic } from '@codemirror/lint';
import type { ConfigData } from 'wikiparser-node';
import type { MwConfig } from './token';
import type { DocRange } from './fold';
import type { Option, LiveOption } from './linter';
export type { MwConfig };
export type LintSource = ((doc: Text) => Diagnostic[] | Promise<Diagnostic[]>) & {
    fixer?: (doc: Text, rule?: string) => string | Promise<string>;
};
export type Addon<T> = [(config?: T, cm?: CodeMirror6) => Extension, Record<string, T>];
export type Dialect = 'sanitized-css' | undefined;
/** CodeMirror 6 编辑器 */
export declare class CodeMirror6 {
    #private;
    getWikiConfig?: () => Promise<ConfigData>;
    langConfig: MwConfig | undefined;
    dialect: Dialect;
    get textarea(): HTMLTextAreaElement;
    get view(): EditorView | undefined;
    get lang(): string;
    get visible(): boolean;
    /**
     * @param textarea 文本框
     * @param lang 语言
     * @param config 语言设置
     * @param init 是否初始化
     */
    constructor(textarea: HTMLTextAreaElement, lang?: string, config?: unknown, init?: boolean);
    /**
     * 初始化编辑器
     * @param config 语言设置
     */
    initialize(config?: unknown): void;
    /**
     * 设置语言
     * @param lang 语言
     * @param config 语言设置
     */
    setLanguage(lang?: string, config?: unknown): void | Promise<void>;
    /**
     * 开始语法检查
     * @param lintSource 语法检查函数
     */
    lint(lintSource?: LintSource): void;
    /** 立即更新语法检查 */
    update(): void;
    /**
     * 添加扩展
     * @param names 扩展名
     */
    prefer(names: string[] | Record<string, boolean>): void;
    /**
     * 设置缩进
     * @param indent 缩进字符串
     */
    setIndent(indent: string): void;
    /**
     * 设置文本换行
     * @param wrapping 是否换行
     */
    setLineWrapping(wrapping: boolean): void;
    /**
     * 获取默认linter
     * @param opt 选项
     */
    getLinter(opt?: Option | LiveOption): Promise<LintSource | undefined>;
    /**
     * 重设编辑器内容
     * @param insert 新内容
     */
    setContent(insert: string): void;
    /**
     * 在编辑器和文本框之间切换
     * @param show 是否显示编辑器
     */
    toggle(show?: boolean): void;
    /** 销毁实例 */
    destroy(): void;
    /**
     * 添加额外快捷键
     * @param keys 快捷键
     */
    extraKeys(keys: KeyBinding[]): void;
    /**
     * 设置翻译信息
     * @param messages 翻译信息
     */
    localize(messages?: Record<string, string>): void;
    /**
     * 获取语法树节点
     * @param position 位置
     */
    getNodeAt(position: number): SyntaxNode | undefined;
    /**
     * 滚动至指定位置
     * @param position 位置
     */
    scrollTo(position?: number | {
        anchor: number;
        head: number;
    }): void;
    /**
     * 替换选中内容
     * @param view
     * @param func 替换函数
     */
    static replaceSelections(view: EditorView, func: (str: string, range: DocRange) => string | [string, number, number?]): void;
    /**
     * 将wikiparser-node设置转换为codemirror-mediawiki设置
     * @param config
     */
    static getMwConfig(config: ConfigData): MwConfig;
}
