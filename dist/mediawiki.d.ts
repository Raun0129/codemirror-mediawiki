/**
 * @author MusikAnimal, Bhsd and others
 * @license GPL-2.0-or-later
 * @see https://gerrit.wikimedia.org/g/mediawiki/extensions/CodeMirror
 */
import { LanguageSupport } from '@codemirror/language';
import { MediaWiki } from './token';
import type { StreamParser, TagStyle } from '@codemirror/language';
import type { CompletionSource, Completion } from '@codemirror/autocomplete';
import type { MwConfig } from './token';
/**
 * 判断节点是否包含指定类型
 * @param types 节点类型
 * @param names 指定类型
 */
export declare const hasTag: (types: Set<string>, names: string | string[]) => boolean;
export declare class FullMediaWiki extends MediaWiki {
    #private;
    readonly nsRegex: RegExp;
    readonly functionSynonyms: Completion[];
    readonly doubleUnderscore: Completion[];
    readonly extTags: Completion[];
    readonly htmlTags: Completion[];
    readonly protocols: Completion[];
    readonly imgKeys: Completion[];
    readonly htmlAttrs: Completion[];
    readonly elementAttrs: Map<string | undefined, Completion[]>;
    readonly extAttrs: Map<string, Completion[]>;
    constructor(config: MwConfig);
    /**
     * This defines the actual CSS class assigned to each tag/token.
     *
     * @see https://codemirror.net/docs/ref/#language.TagStyle
     */
    getTagStyles(): TagStyle[];
    mediawiki(tags?: string[]): StreamParser<any>;
    /** 自动补全魔术字和标签名 */
    get completionSource(): CompletionSource;
}
/**
 * Gets a LanguageSupport instance for the MediaWiki mode.
 * @param config Configuration for the MediaWiki mode
 */
export declare const mediawiki: (config: MwConfig) => LanguageSupport;
/**
 * Gets a LanguageSupport instance for the mixed MediaWiki-HTML mode.
 * @param config Configuration for the MediaWiki mode
 */
export declare const html: (config: MwConfig) => LanguageSupport;
