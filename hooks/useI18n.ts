import { useContext } from 'react';
import { LanguageContext } from '@/hooks/useLanguageContext';
import { RawTranslations } from '@/types/i18n-types';

const findNestedValue = (obj: RawTranslations, keysArray: string[]): string | undefined => {
    const reduced = keysArray.reduce<RawTranslations | string | undefined>((acc, key) => {
        if (acc && typeof acc === 'object') {
            return (acc as RawTranslations)[key];
        }
        return undefined;
    }, obj);

    return typeof reduced === 'string' ? reduced : undefined;
};

export const useI18n = () => {
    const { language, translations } = useContext(LanguageContext) ?? {};

    if ([language, translations].some(attr => typeof attr === 'undefined')) {
        throw new Error('useI18n must be used within a LanguageProvider');
    }

    const t = (slug: string): string => {
        const keysArray = slug.split('.');
        const translation = translations ? findNestedValue(translations, keysArray) ?? slug : '';

        return translation;
    };

    return { t };
};

