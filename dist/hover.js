import { hoverTooltip } from '@codemirror/view';
import { loadScript, getLSP } from '@bhsd/common';
let md;
/**
 * 将索引转换为位置
 * @param doc Text 实例
 * @param index 索引
 */
export const indexToPos = (doc, index) => {
    const line = doc.lineAt(index);
    return { line: line.number - 1, character: index - line.from };
};
/**
 * 将位置转换为索引
 * @param doc Text 实例
 * @param pos 位置
 */
export const posToIndex = (doc, pos) => {
    const line = doc.line(pos.line + 1);
    return Math.min(line.from + pos.character, line.to);
};
/**
 * 创建 TooltipView
 * @param view EditorView 实例
 * @param innerHTML 提示内容
 */
export const createTooltipView = (view, innerHTML) => {
    const dom = document.createElement('div'), inner = document.createElement('div');
    dom.append(inner);
    dom.className = 'cm-tooltip-hover';
    dom.style.font = getComputedStyle(view.contentDOM).font;
    inner.innerHTML = innerHTML;
    return { dom };
};
export default (cm) => hoverTooltip(async (view, pos) => {
    const { state: { doc } } = view, hover = await getLSP(view, false, cm.getWikiConfig)?.['provideHover'](doc.toString(), indexToPos(doc, pos));
    if (hover) {
        await loadScript('npm/markdown-it/dist/markdown-it.min.js', 'markdownit', true);
        md ??= markdownit();
        const { end } = hover.range;
        return {
            pos,
            end: posToIndex(doc, end),
            above: true,
            create() {
                return createTooltipView(view, md.render(hover.contents.value));
            },
        };
    }
    return null;
});
