/**
 * @file Configuration for the MediaWiki highlighting mode for CodeMirror.
 * @author MusikAnimal and others
 * @license GPL-2.0-or-later
 * @see https://gerrit.wikimedia.org/g/mediawiki/extensions/CodeMirror
 */
import { Tag } from '@lezer/highlight';
/**
 * All HTML/XML tags permitted in MediaWiki Core.
 *
 * @see https://www.mediawiki.org/wiki/Extension:CodeMirror#Extension_integration
 */
export declare const htmlTags: string[], 
/** HTML tags that are only self-closing. */
voidHtmlTags: string[], 
/** HTML tags that can be self-closing. */
selfClosingTags: string[], 
/**
 * Mapping of MediaWiki-esque token identifiers to a standardized lezer highlighting tag.
 * Values are one of the default highlighting tags.
 *
 * Once we allow use of other themes, we may want to tweak these values for aesthetic reasons.
 *
 * @see https://lezer.codemirror.net/docs/ref/#highlight.tags
 * @internal
 */
tokens: {
    apostrophes: string;
    comment: string;
    convertBracket: string;
    convertDelimiter: string;
    convertFlag: string;
    convertLang: string;
    doubleUnderscore: string;
    em: string;
    error: string;
    extLink: string;
    extLinkBracket: string;
    extLinkProtocol: string;
    extLinkText: string;
    extTag: string;
    extTagAttribute: string;
    extTagAttributeValue: string;
    extTagBracket: string;
    extTagName: string;
    fileDelimiter: string;
    fileText: string;
    freeExtLink: string;
    freeExtLinkProtocol: string;
    hr: string;
    htmlEntity: string;
    htmlTagAttribute: string;
    htmlTagAttributeValue: string;
    htmlTagBracket: string;
    htmlTagName: string;
    imageParameter: string;
    linkBracket: string;
    linkDelimiter: string;
    linkPageName: string;
    linkText: string;
    linkToSection: string;
    list: string;
    magicLink: string;
    pageName: string;
    parserFunction: string;
    parserFunctionBracket: string;
    parserFunctionDelimiter: string;
    parserFunctionName: string;
    redirect: string;
    section: string;
    sectionHeader: string;
    signature: string;
    skipFormatting: string;
    strong: string;
    tableBracket: string;
    tableCaption: string;
    tableDefinition: string;
    tableDefinitionValue: string;
    tableDelimiter: string;
    tableDelimiter2: string;
    tableTd: string;
    tableTh: string;
    template: string;
    templateArgumentName: string;
    templateBracket: string;
    templateDelimiter: string;
    templateName: string;
    templateVariable: string;
    templateVariableBracket: string;
    templateVariableDelimiter: string;
    templateVariableName: string;
}, 
/**
 * These are custom tokens (a.k.a. tags) that aren't mapped to any of the standardized tags.
 *
 * @see https://codemirror.net/docs/ref/#language.StreamParser.tokenTable
 * @see https://lezer.codemirror.net/docs/ref/#highlight.Tag%5Edefine
 */
tokenTable: Record<string, Tag>;
