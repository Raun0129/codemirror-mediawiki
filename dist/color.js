import { splitColors, numToHex } from '@bhsd/common';
import { EditorView } from '@codemirror/view';
import { parseCallExpression, parseColorLiteral, ColorType, colorPicker, colorPickerTheme, makeColorPicker, wrapperClassName, } from '@bhsd/codemirror-css-color-picker';
export const discoverColors = (_, from, to, type, doc) => {
    if (!/mw-(?:(?:ext|html)tag-attribute-value|table-definition)/u.test(type)
        && (!/mw-(?:template|parserfunction)(?:$|_)/u.test(type)
            || !/[|=]/u.test(doc.sliceString(from - 1, from))
            || !/[|\n]/u.test(doc.sliceString(to, to + 1)) && doc.sliceString(to, to + 2) !== '}}')
        && (!/mw-templatevariable(?:$|_)/u.test(type)
            || doc.sliceString(from - 1, from) !== '|'
            || doc.sliceString(to, to + 1) !== '|' && doc.sliceString(to, to + 3) !== '}}}')) {
        return null;
    }
    return splitColors(doc.sliceString(from, to)).filter(([, , , isColor]) => isColor)
        .map(([s, start, end]) => {
        const color = s.startsWith('#') ? parseColorLiteral(s) : parseCallExpression(s);
        let alpha = color?.alpha;
        if (color?.colorType !== ColorType.hex) {
            alpha &&= numToHex(parseFloat(alpha.slice(1)) / (alpha.endsWith('%') ? 100 : 1));
        }
        return color && {
            ...color,
            colorType: ColorType.hex,
            alpha: alpha ?? '',
            from: from + start,
            to: from + end,
        };
    }).filter(Boolean);
};
export default [
    ([e, style] = []) => e
        ? [
            e,
            EditorView.theme({
                [`.${wrapperClassName}`]: {
                    outline: 'none',
                    ...style,
                },
                [`.${wrapperClassName} input[type="color"]`]: {
                    outline: '1px solid #eee',
                },
            }),
        ]
        : [],
    {
        css: [colorPicker],
        mediawiki: [
            [makeColorPicker({ discoverColors }), colorPickerTheme],
            { marginLeft: '0.6ch' },
        ],
    },
];
