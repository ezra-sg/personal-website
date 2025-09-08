import { renderHook } from '@testing-library/react';

import { LanguageContext, useLanguageContext } from '@/hooks/useLanguageContext';
import { SupportedLanguages } from '@/types/i18n-types';

describe('useLanguageContext', () => {
    it('should throw an error when used outside of a provider', () => {
        // Temporarily mock console.error to prevent log spam
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => renderHook(() => useLanguageContext())).toThrow();

        // Restore original console.error
        console.error = originalError;
    });

    it('should return the context language', () => {
        const { result } = renderHook(() => useLanguageContext(), {
            wrapper: ({ children }) => (
                <LanguageContext.Provider value={{ language: SupportedLanguages.english, translations: {} }}>
                    {children}
                </LanguageContext.Provider>
            ),
        });

        expect(result.current.language).toBe(SupportedLanguages.english);
    });
});
