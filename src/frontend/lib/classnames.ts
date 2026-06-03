type ClsVal = string | number | null | undefined | boolean | Record<string, string | number | null | undefined | boolean> | ClsArr;
type ClsArr = readonly ClsVal[];

export function cn(...args: ClsVal[]): string {
    const flat = (v: ClsVal): (string | number | null | undefined | boolean)[] =>
        Array.isArray(v) ? v.flatMap(flat) : typeof v === 'object' && v !== null ? Object.values(v) as (string | number | null | undefined | boolean)[] : [v];
    return args.flatMap(v => flat(v)).filter(Boolean).join(' ');
}
