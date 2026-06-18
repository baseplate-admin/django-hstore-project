import { Signal } from './_base_';

type IconKey = 'delete' | 'add' | 'edit';

const iconKeys = ['delete', 'add', 'edit'] as const;

export const iconSignals = Object.fromEntries(iconKeys.map(k => [k, new Signal('')])) as Record<(typeof iconKeys)[number], Signal<string>>;

export function setFromAttributes(el: HTMLElement) {
    const map: [IconKey, string][] = [
        ['delete', 'delete_svg_src'],
        ['add', 'add_svg_src'],
        ['edit', 'edit_svg_src'],
    ];
    for (const [key, attr] of map) {
        const src = el.getAttribute(attr);
        if (src) iconSignals[key].value = src;
    }
}
