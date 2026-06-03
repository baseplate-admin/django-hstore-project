type StoreState = Record<'delete_svg_src' | 'add_svg_src' | 'edit_svg_src', string>;

const state: StoreState = { delete_svg_src: '', add_svg_src: '', edit_svg_src: '' };
const listeners = new Set<() => void>();

export function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

export function getState(): StoreState {
    return structuredClone(state);
}

export function setState(updates: Partial<StoreState>) {
    Object.assign(state, updates);
    listeners.forEach(fn => fn());
}
