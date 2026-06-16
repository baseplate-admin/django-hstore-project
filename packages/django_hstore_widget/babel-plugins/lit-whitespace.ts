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
            const match = line.match(/^(\s*)/);
            if (match) {
                minIndent = Math.min(minIndent, match[1].length);
            }
        }

        if (!Number.isFinite(minIndent)) {
            return '';
        }

        return lines
            .map(line => (line.trim().length === 0 ? '' : line.slice(minIndent)))
            .join('')
            .trim();
    }

    const visitor = {
        TaggedTemplateExpression(path: NodePath<TaggedTemplateExpression>) {
            const { node } = path;
            if (!isLitTag(node)) return;

            const template = node.quasi as TemplateLiteral;

            template.quasis.forEach((quasi) => {
                const stripped = stripQuasiIndentation(quasi.value.raw);
                quasi.value.raw = stripped;
                quasi.value.cooked = stripped;
            });
        },
    };

    return { name: 'lit-whitespace', visitor };
}

export default litWhitespacePlugin;
