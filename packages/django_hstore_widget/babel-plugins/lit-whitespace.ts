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

        let result = lines
            .map(line => (line.trim().length === 0 ? '' : line.slice(minIndent)))
            .join('')
            .replace(/>\s+</g, '><')
            .replace(/<\s+/g, '<')
            .trim();

        // Collapse whitespace between attribute boundaries
        // e.g., attr"  .next_attr  or  }  @event
        result = result.replace(/["}]\s+([.@?])/g, '$1');

        // Collapse whitespace before closing tags (indentation artifact in text content)
        // e.g., "Add row    </button>" → "Add row</button>"
        result = result.replace(/\s+(<\/)/g, '$1');

        // Collapse multiple spaces inside tag definitions to single space
        let prev = '';
        let iterations = 0;
        while (prev !== result && iterations < 10) {
            prev = result;
            result = result.replace(/([a-zA-Z0-9_"})])  +(?=[a-zA-Z@">/])/g, '$1 ');
            iterations++;
        }

        return result;
    }

    const visitor = {
        TaggedTemplateExpression(path: NodePath<TaggedTemplateExpression>) {
            const { node } = path;

            if (!isLitTag(node)) return;

            const template = node.quasi as TemplateLiteral;

            template.quasis.forEach((quasi, index, quasis) => {
                const prevQuasi = index > 0 ? quasis[index - 1] : null;
                const rawEnd = prevQuasi?.value.raw ?? '';
                const isAfterQuote = rawEnd.endsWith('"');
                const isAfterInterp = rawEnd.endsWith('}');
                const stripped = stripQuasiIndentation(quasi.value.raw);

                // Trim leading whitespace when after interpolation (indentation artifact)
                const trimmed = isAfterInterp ? stripped.trimStart() : stripped;

                // Preserve space after " when followed by word char (inside attribute value)
                if (isAfterQuote && /^[a-zA-Z]/.test(trimmed) && !trimmed.startsWith('"')) {
                    quasi.value.raw = ' ' + trimmed;
                    quasi.value.cooked = ' ' + trimmed;
                }
                else if (trimmed === '' && (isAfterQuote || isAfterInterp)) {
                    quasi.value.raw = ' ';
                    quasi.value.cooked = ' ';
                }
                else {
                    quasi.value.raw = trimmed;
                    quasi.value.cooked = trimmed;
                }
            });
        },
    };

    return { name: 'lit-whitespace', visitor };
}

export default litWhitespacePlugin;
