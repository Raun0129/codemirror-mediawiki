export interface KeymapConfig {
    key: string;
    desc: string;
    pre?: string;
    post?: string;
    splitlines?: boolean;
}
export declare const keybindings: KeymapConfig[];
/**
 * 将文本各行包裹在指定的前后缀中
 * @param text 跨行文本
 * @param pre 前缀
 * @param post 后缀
 */
export declare const encapsulateLines: (text: string, pre: string, post: string) => string;
