type ClassNameValue = string | number | null | undefined | boolean | Record<string, string | number | null | undefined | boolean> | ClassNameArray;
type ClassNameArray = readonly ClassNameValue[];

/**
 * Joins conditional class names into a single space-separated string.
 * Filters out falsy values (null, undefined, false, 0, empty string).
 * Supports nested arrays and objects for flexible class composition.
 */
export function cn(...classNameArguments: ClassNameValue[]): string {
    const flattenClassNameValues = (value: ClassNameValue): (string | number | null | undefined | boolean)[] =>
        Array.isArray(value)
            ? value.flatMap(flattenClassNameValues)
            : typeof value === 'object' && value !== null
              ? (Object.values(value) as (string | number | null | undefined | boolean)[])
              : [value];

    return classNameArguments
        .flatMap(argument => flattenClassNameValues(argument))
        .filter(Boolean)
        .join(' ');
}
