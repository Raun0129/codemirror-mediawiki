export declare const noDetectionLangs: Set<string>;
/**
 * 检测文本的缩进方式
 * @param text 文本内容
 * @param defaultIndent 默认缩进方式
 * @param lang 语言
 */
export declare const detectIndent: (text: string, defaultIndent: string, lang: string) => string;
