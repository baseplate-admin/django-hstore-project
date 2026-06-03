// Reactive store replacing @stencil/store
// Uses a simple subscription-based reactive pattern

type StoreState = {
    delete_svg_src: string;
    add_svg_src: string;
    edit_svg_src: string;
};

type Listener = () => void;

const state: StoreState = {
    delete_svg_src: '',
    add_svg_src: '',
    edit_svg_src: '',
};

const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getState(): StoreState {
    return { ...state };
}

export function setState(updates: Partial<StoreState>) {
    for (const [key, value] of Object.entries(updates)) {
        (state as Record<string, string>)[key] = value;
    }
    for (const listener of listeners) {
        listener();
    }
}
