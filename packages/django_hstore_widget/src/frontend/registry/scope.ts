type ScopeKey = string;

interface ScopeState {
    count: number;
    active: boolean;
}

const scopes = new Map<ScopeKey, ScopeState>();

export function enterScope(key: ScopeKey) {
    const s = scopes.get(key) ?? { count: 0, active: false };
    s.count++;
    s.active = true;
    scopes.set(key, s);
}

export function exitScope(key: ScopeKey) {
    const s = scopes.get(key);
    if (!s) return;

    s.count--;

    if (s.count <= 0) {
        scopes.delete(key);
    }
}

export function isScopeActive(key: ScopeKey): boolean {
    return scopes.get(key)?.active === true;
}
