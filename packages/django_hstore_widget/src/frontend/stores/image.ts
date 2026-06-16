type IconStoreState = Record<'delete_svg_src' | 'add_svg_src' | 'edit_svg_src', string>;

const storeState: IconStoreState = { delete_svg_src: '', add_svg_src: '', edit_svg_src: '' };
const stateChangeListeners = new Set<() => void>();

/**
 * Subscribe to store state changes. Returns an unsubscribe function.
 */
export function subscribe(listenerCallback: () => void): () => void {
    stateChangeListeners.add(listenerCallback);
    return () => stateChangeListeners.delete(listenerCallback);
}

/**
 * Get a deep clone of the current store state.
 */
export function getState(): IconStoreState {
    return structuredClone(storeState);
}

/**
 * Update the store state and notify all subscribed listeners.
 */
export function setState(stateUpdates: Partial<IconStoreState>) {
    Object.assign(storeState, stateUpdates);
    stateChangeListeners.forEach((listenerCallback) => listenerCallback());
}
