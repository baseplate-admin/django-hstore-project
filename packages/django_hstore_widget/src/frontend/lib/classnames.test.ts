import { cn } from './classnames';

describe('cn (conditional classnames)', () => {
    test('returns the class string when condition is true', () => {
        const result = cn(true && 'active-class');
        expect(result).toBe('active-class');
    });

    test('returns empty string when condition is false', () => {
        const result = cn(false && 'inactive-class');
        expect(result).toBe('');
    });

    test('returns the class string when passed directly without condition', () => {
        const result = cn('always-visible');
        expect(result).toBe('always-visible');
    });

    test('handles multiple conditional classes', () => {
        const result = `${cn(true && 'first')} ${cn(false && 'second')} ${cn(true && 'third')}`;
        expect(result).toBe('first  third');
    });

    test('returns empty string for undefined input', () => {
        const result = cn(false && undefined);
        expect(result).toBe('');
    });
});
