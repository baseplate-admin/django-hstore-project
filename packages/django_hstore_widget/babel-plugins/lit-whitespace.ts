import type { NodePath } from '@babel/traverse';
import type { TaggedTemplateExpression, TemplateLiteral } from '@babel/types';

function litWhitespacePlugin() {
    const litTagNames = new Set(['html', 'svg', 'css', 'lit_html_b', 'lit_css_b']);

    function isLitTag(node: { tag?: { type?: string; name?: string } }): boolean {
        return node.tag?.type === 'Identifier' && litTagNames.has(node.tag.name ?? '');
    }

    function stripQuasiIndentation(text: string): string {
        const lines = text.split('\n');

        if (lines.length <= 1) {
            return text.trim();
        }

        let minIndent = Infinity;
        for (const line of lines) {
            if (line.trim().length === 0) continue;
            const m = line.match(/^(\s*)/);
            if (m) minIndent = Math.min(minIndent, m[1].length);
        }

        if (!Number.isFinite(minIndent)) return '';

        return lines
            .map(line => {
                if (line.trim().length === 0) return '';
                const dedented = line.slice(minIndent);
                const trimmed = dedented.trim();
                if (!trimmed) return '';
                // Preserve one leading space for text content (not tags)
                if (!trimmed.startsWith('<')) return ' ' + trimmed;
                return trimmed;
            })
            .join('')
            .trim();
    }

    const visitor = {
        TaggedTemplateExpression(path: NodePath<TaggedTemplateExpression>) {
            const { node } = path;
            if (!isLitTag(node)) return;

            const template = node.quasi as TemplateLiteral;

            template.quasis.forEach((quasi, idx, quasis) => {
                const prevQuasi = idx > 0 ? quasis[idx - 1] : null;
                const prevEndsQuote = prevQuasi ? prevQuasi.value.raw.endsWith('"') : false;
                const prevEndsBrace = prevQuasi ? prevQuasi.value.raw.endsWith('}') : false;

                const stripped = stripQuasiIndentation(quasi.value.raw);

                // Empty quasi between interpolations: add space for class concatenation
                if (stripped === '' && (prevEndsQuote || prevEndsBrace)) {
                    quasi.value.raw = ' ';
                    quasi.value.cooked = ' ';
                }
                // After quote, preserve space if content starts with word char (inside attr value)
                else if (prevEndsQuote && /^[a-zA-Z]/.test(stripped) && !stripped.startsWith('"') && !stripped.startsWith('<')) {
                    quasi.value.raw = ' ' + stripped;
                    quasi.value.cooked = ' ' + stripped;
                }
                else {
                    quasi.value.raw = stripped;
                    quasi.value.cooked = stripped;
                }
            });
        },
    };

    return { name: 'lit-whitespace', visitor };
}

export default litWhitespacePlugin;
