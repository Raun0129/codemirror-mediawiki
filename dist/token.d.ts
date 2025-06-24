/**
 * @author pastakhov, MusikAnimal, Bhsd and others
 * @license GPL-2.0-or-later
 * @see https://gerrit.wikimedia.org/g/mediawiki/extensions/CodeMirror
 */
import { Tag } from '@lezer/highlight';
import { tokens } from './config';
import type { MwConfig as MwConfigBase } from '@bhsd/common/dist/cm';
import type { EditorState } from '@codemirror/state';
import type { StreamParser, StringStream as StringStreamBase } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';
declare type Style = string | [string];
declare type Tokenizer<T = Style> = ((stream: StringStream, state: State) => T) & {
    args?: unknown[];
};
declare type NestCount = 'nTemplate' | 'nExt' | 'nVar' | 'nLink' | 'nExtLink';
declare interface Nesting extends Record<NestCount, number> {
    extName: string | false;
    extState: object | false;
}
declare interface State extends Nesting {
    readonly stack: Tokenizer[];
    readonly inHtmlTag: string[];
    tokenize: Tokenizer;
    extMode: StreamParser<object> | false;
    lbrack: boolean | undefined;
    bold: boolean;
    italic: boolean;
    dt: Partial<Nesting> & {
        n: number;
        html: number;
    };
    sof: boolean;
    redirect: {
        colon: boolean;
    } | false;
    imgLink: boolean;
    data: MediaWikiData;
}
declare interface Token {
    readonly char?: string | undefined;
    readonly string: string;
    readonly state: State;
    pos: number;
    style: Style;
}
declare interface StringStream extends StringStreamBase {
    match(pattern: string, consume?: boolean, caseInsensitive?: boolean): true | null;
    match(pattern: RegExp, consume?: boolean): RegExpMatchArray | null;
}
export type TagName = keyof typeof tokens;
export type ApiSuggestions = [string, string?][];
/**
 * 获取维基链接建议
 * @param search 搜索字符串，开头不包含` `
 * @param namespace 命名空间
 * @param subpage 是否为子页面
 */
export type ApiSuggest = (search: string, namespace?: number, subpage?: boolean) => ApiSuggestions | Promise<ApiSuggestions>;
export interface MwConfig extends MwConfigBase {
    nsid: Record<string, number>;
    variants?: string[];
    img?: Record<string, string>;
    permittedHtmlTags?: string[];
    implicitlyClosedHtmlTags?: string[];
    linkSuggest?: ApiSuggest;
    paramSuggest?: ApiSuggest;
    titleParser?: (state: EditorState, node: SyntaxNode) => string | undefined;
    isbnParser?: (link: string) => string;
}
declare class MediaWikiData {
    /** 已解析的节点 */
    readonly readyTokens: Token[];
    /** 当前起始位置 */
    oldToken: Token | null;
    /** 可能需要回滚的`'''` */
    mark: number | null;
    firstSingleLetterWord: number | null;
    firstMultiLetterWord: number | null;
    firstSpace: number | null;
    readonly tags: string[];
    constructor(tags: string[]);
}
/** Adapted from the original CodeMirror 5 stream parser by Pavel Astakhov */
export declare class MediaWiki {
    readonly config: MwConfig;
    readonly tokenTable: {
        [x: string]: Tag;
    };
    readonly hiddenTable: Record<string, Tag>;
    readonly permittedHtmlTags: Set<string | undefined>;
    readonly voidHtmlTags: Set<string>;
    readonly urlProtocols: RegExp;
    readonly linkRegex: RegExp;
    readonly fileRegex: RegExp;
    readonly redirectRegex: RegExp;
    readonly img: string[];
    readonly imgRegex: RegExp;
    readonly convertRegex: RegExp;
    readonly convertSemicolon: RegExp | undefined;
    readonly convertLang: RegExp | undefined;
    readonly tags: string[];
    readonly hasVariants: boolean;
    readonly preRegex: [RegExp, RegExp];
    readonly autocompleteNamespaces: {
        0: string;
        6: string;
        8: string;
        10: string;
        274: string;
        828: string;
    };
    constructor(config: MwConfig);
    /**
     * Dynamically register a token in CodeMirror.
     * This is solely for use by this.addTag() and CodeMirrorModeMediaWiki.makeLocalStyle().
     *
     * @param token
     * @param hidden Whether the token is not highlighted
     * @param parent
     */
    addToken(token: string, hidden?: boolean, parent?: Tag): void;
    /**
     * Register the ground tokens. These aren't referenced directly in the StreamParser, nor do
     * they have a parent Tag, so we don't need them as constants like we do for other tokens.
     * See makeLocalStyle() for how these tokens are used.
     */
    registerGroundTokens(): void;
    inChars({ length }: string, tag: TagName): Tokenizer;
    inStr(str: string, tag: TagName | false, errorTag?: TagName): Tokenizer;
    eatWikiText(style: string): Tokenizer;
    eatApostrophes(obj: Pick<State, 'bold' | 'italic'>): Tokenizer<string | false>;
    eatExternalLinkProtocol({ length }: string, free?: boolean): Tokenizer;
    inExternalLink(text?: boolean): Tokenizer;
    eatFreeExternalLink(this: void, stream: StringStream, state: State): Style;
    inLink(file: boolean, section?: boolean): Tokenizer;
    inLinkText(file: boolean, gallery?: boolean): Tokenizer;
    toEatImageParameter(stream: StringStream, state: State): void;
    eatList(stream: StringStream, state: State): string;
    eatDoubleUnderscore(style: string, stream: StringStream, state: State): Style;
    get eatStartTable(): Tokenizer;
    inTableDefinition(tr?: boolean, quote?: string): Tokenizer;
    get inTable(): Tokenizer;
    inTableCell(style: string, needAttr?: boolean, firstLine?: boolean): Tokenizer;
    inSectionHeader(str: string): Tokenizer;
    get inComment(): Tokenizer;
    eatExtTag(tagname: string, isCloseTag: boolean, state: State): string;
    eatHtmlTag(tagname: string, isCloseTag: boolean, state: State): string;
    eatTagName(name: string, isCloseTag?: boolean, isHtmlTag?: boolean): Tokenizer;
    inHtmlTagAttribute(name: string, quote?: string): Tokenizer;
    inExtTagAttribute(name: string, quote?: string, isLang?: boolean, isPage?: boolean): Tokenizer;
    eatExtTagArea(name: string): Tokenizer;
    inExtTokens(origString: string): Tokenizer;
    inVariable(pos?: number): Tokenizer;
    eatTransclusion(stream: StringStream, state: State): string | undefined;
    inParserFunctionName(invoke?: number, n?: number, ns?: number, subst?: boolean): Tokenizer;
    inTemplatePageName(haveEaten?: boolean, anchor?: boolean): Tokenizer;
    inParserFunctionArgument(module?: number, n?: number, ns?: number): Tokenizer;
    inTemplateArgument(expectName?: boolean, parserFunction?: boolean): Tokenizer;
    inConvert(style: string, needFlag?: boolean, needLang?: boolean, plain?: boolean): Tokenizer;
    eatEntity(stream: StringStream, style: string): string;
    /**
     * main entry
     *
     * @see https://codemirror.net/docs/ref/#language.StreamParser
     *
     * @param tags
     */
    mediawiki(tags?: string[]): StreamParser<State>;
    'text/mediawiki'(tags?: string[]): StreamParser<State>;
    'text/nowiki'(): StreamParser<Record<string, never>>;
    inPre(begin?: boolean): Tokenizer<string>;
    'text/pre'(): StreamParser<State>;
    inNested(tag: string): Tokenizer<string>;
    'text/references'(tags: string[]): StreamParser<State>;
    'text/choose'(tags: string[]): StreamParser<State>;
    'text/combobox'(tags: string[]): StreamParser<State>;
    get inInputbox(): Tokenizer<string>;
    'text/inputbox'(): StreamParser<State>;
    inGallery(section?: boolean): Tokenizer;
    'text/gallery'(tags: string[]): StreamParser<State>;
    javascript(): StreamParser<unknown>;
    css(): StreamParser<unknown>;
    json(): StreamParser<unknown>;
}
export {};
