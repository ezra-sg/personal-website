
/**
 * A utility for succinctly composing class names for DOM elements.
 * Implementation comes from Lumo, tweaked by me for better typing and brevity.
 *
 * @param inputs the className inputs to evaluate for concatenation
 * @returns a string of class names to apply to an element
 *
 * @example
 * // without cn:
 * // const bannerClasses =
 * //     (isRemoving ? '-top-40' : 'top-0') + ' ' +
 * //     (isHidden ? 'hidden' : 'flex') + ' ' +
 * //     'fixed right-0 left-0 h-fit py-2 px-4 bg-amber-50 shadow-sm z-50 ' +
 * //     'items-center justify-center flex-col transition-all duration-300 ' +
 * //     'dark:bg-stone-950';
 *
 * // with cn:
 * const bannerClasses = cn(
 *     isRemoving ? '-top-40' : 'top-0',
 *     isHidden ? 'hidden' : 'flex',
 *     'fixed right-0 left-0 h-fit py-2 px-4 bg-amber-50 shadow-sm z-50',
 *     'items-center justify-center flex-col transition-all duration-300',
 *     'dark:bg-stone-950'
 *);
 */
export default function cn(...inputs: (string | false | null | undefined | Record<string, boolean>)[]): string {
    return inputs
        .flatMap(item => {
            if (typeof item === 'string') return item;
            if (!item) return [];
            if (Array.isArray(item)) return cn(...item);
            // object form: {className: true/false}
            return Object.entries(item)
                .flatMap(([key, value]) => Boolean(value) ? [key] : [])
        })
        .join(' ');
}
