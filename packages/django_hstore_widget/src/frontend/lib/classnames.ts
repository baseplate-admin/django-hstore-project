export function cn(...classes: (string | Record<string, boolean> | undefined | null | false | '')[]): string {
    return classes
        .map(part => {
            if (typeof part === 'object' && part !== null) {
                return Object.entries(part)
                    .filter(([, active]) => active)
                    .map(([className]) => className);
            }
            return part ? [part] : [];
        })
        .flat()
        .filter(Boolean)
        .join(' ');
}
