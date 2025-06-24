import { Decoration, EditorView } from '@codemirror/view';
import { StateField } from '@codemirror/state';
import { ensureSyntaxTree } from '@codemirror/language';
import { voidHtmlTags, selfClosingTags } from './config';
class Tag {
    get closing() {
        return isClosing(this.first, this.type, this.state, true);
    }
    get selfClosing() {
        return voidHtmlTags.includes(this.name)
            || (this.type === 'ext' || selfClosingTags.includes(this.name))
                && isClosing(this.last, this.type, this.state);
    }
    get from() {
        const { first: { from, to }, state } = this;
        return from + state.sliceDoc(from, to).lastIndexOf('<');
    }
    get to() {
        const { last: { from, to }, state } = this;
        return from + state.sliceDoc(from, to).indexOf('>') + 1;
    }
    constructor(type, name, first, last, state) {
        this.type = type;
        this.name = name;
        this.first = first;
        this.last = last;
        this.state = state;
    }
}
const isTag = ({ name }) => /-(?:ext|html)tag-(?!bracket)/u.test(name), isTagComponent = (s) => {
    const reHtml = new RegExp(`-htmltag-${s}`, 'u'), reExt = new RegExp(`-exttag-${s}`, 'u');
    return ({ name }, type) => (type === 'ext' ? reExt : reHtml).test(name);
}, isBracket = isTagComponent('bracket'), isName = isTagComponent('name'), isClosing = (node, type, state, first) => isBracket(node, type)
    && state.sliceDoc(node.from, node.to)[first ? 'endsWith' : 'startsWith']('/'), getName = (state, { from, to }) => state.sliceDoc(from, to).trim().toLowerCase();
/**
 * 获取标签信息，破损的HTML标签会返回`null`
 * @param state
 * @param node 语法树节点
 */
export const getTag = (state, node) => {
    const type = node.name.includes('exttag') ? 'ext' : 'html';
    let { nextSibling, prevSibling } = node, nameNode = isName(node, type) ? node : null;
    while (nextSibling && !isBracket(nextSibling, type)) {
        ({ nextSibling } = nextSibling);
    }
    if (!nextSibling
        || isBracket(nextSibling, type) && state.sliceDoc(nextSibling.from, nextSibling.from + 1) === '<') {
        return null;
    }
    while (prevSibling && !isBracket(prevSibling, type)) {
        nameNode ??= isName(prevSibling, type) ? prevSibling : null;
        ({ prevSibling } = prevSibling);
    }
    const name = getName(state, nameNode);
    return new Tag(type, name, prevSibling, nextSibling, state);
};
/**
 * 搜索匹配的标签
 * @param state
 * @param origin 起始标签
 */
const searchTag = (state, origin) => {
    const { type, name, closing } = origin, siblingGetter = closing ? 'prevSibling' : 'nextSibling', endGetter = closing ? 'first' : 'last';
    let stack = closing ? -1 : 1, sibling = origin[endGetter][siblingGetter];
    while (sibling) {
        if (isName(sibling, type) && getName(state, sibling) === name) {
            const tag = getTag(state, sibling);
            if (tag) {
                if (tag.closing) {
                    stack--;
                }
                else {
                    stack += tag.selfClosing ? 0 : 1;
                }
                if (stack === 0) {
                    return tag;
                }
                sibling = tag[endGetter];
            }
        }
        sibling = sibling[siblingGetter];
    }
    return null;
};
/**
 * 匹配标签
 * @param state
 * @param pos 位置
 */
export const matchTag = (state, pos) => {
    const tree = ensureSyntaxTree(state, pos);
    if (!tree) {
        return null;
    }
    let node = tree.resolve(pos, -1);
    if (!isTag(node)) {
        node = tree.resolve(pos, 1);
        if (!isTag(node)) {
            return null;
        }
    }
    const start = getTag(state, node);
    if (!start) {
        return null;
    }
    else if (start.selfClosing) {
        return { matched: true, start };
    }
    const end = searchTag(state, start);
    return end ? { matched: true, start, end } : { matched: false, start };
};
const matchingMark = Decoration.mark({ class: 'cm-matchingTag' }), nonmatchingMark = Decoration.mark({ class: 'cm-nonmatchingTag' });
export default StateField.define({
    create() {
        return Decoration.none;
    },
    update(deco, { docChanged, selection, state }) {
        if (!docChanged && !selection) {
            return deco;
        }
        const decorations = [];
        for (const range of state.selection.ranges) {
            if (range.empty) {
                const match = matchTag(state, range.head);
                if (match) {
                    const mark = match.matched ? matchingMark : nonmatchingMark, { start: { from, to, closing }, end } = match;
                    decorations.push(mark.range(from, to));
                    if (end) {
                        decorations[closing ? 'unshift' : 'push'](mark.range(end.from, end.to));
                    }
                }
            }
        }
        return Decoration.set(decorations);
    },
    provide(f) {
        return EditorView.decorations.from(f);
    },
});
