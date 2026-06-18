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

        // Find min indent from non-empty lines only
        let minIndent = Infinity;
        for (const line of lines) {
            if (line.trim().length === 0) continue;
            const m = line.match(/^(\s*)/);
            if (m) minIndent = Math.min(minIndent, m[1].length);
        }

        // Only strip if there's common indentation across all lines
        if (!Number.isFinite(minIndent) || minIndent === 0) {
            return text;
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

            template.quasis.forEach(quasi => {
                const stripped = stripQuasiIndentation(quasi.value.raw);
                quasi.value.raw = stripped;
                quasi.value.cooked = stripped;
            });
        },
    };

    return { name: 'lit-whitespace', visitor };
}

export default litWhitespacePlugin;
