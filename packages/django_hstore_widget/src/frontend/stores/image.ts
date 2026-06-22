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

export function resolveSvgFromScriptUrl() {
    try {
        const scriptUrl = new URL(import.meta.url);
        const pathParts = scriptUrl.pathname.split('/');
        const adminIndex = pathParts.indexOf('admin');
        if (adminIndex === -1) return;
        pathParts.splice(adminIndex + 1);
        pathParts.push('img');
        const imgBase = scriptUrl.protocol + '//' + scriptUrl.host + pathParts.join('/');
        if (!iconSignals.delete.value) iconSignals.delete.value = imgBase + '/icon-deletelink.svg';
        if (!iconSignals.add.value) iconSignals.add.value = imgBase + '/icon-addlink.svg';
        if (!iconSignals.edit.value) iconSignals.edit.value = imgBase + '/icon-changelink.svg';
    } catch { /* ignore — fall back to Lucide icons */ }
}
