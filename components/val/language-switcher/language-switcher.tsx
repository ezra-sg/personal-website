'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MdLanguage } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { useI18n } from '@/hooks/useI18n';

export default function LanguageSwitcher() {
    const { t } = useI18n();
    const path = usePathname();

    const [isOpen, setIsOpen] = useState(false);

    const buttonRef = useRef<null | HTMLButtonElement>(null);
    const menuRef = useRef<null | HTMLMenuElement>(null);
    const clickawayHandlerRef = useRef<null | ((event: MouseEvent) => void)>(null);
    const documentHasClickawayListener = useRef(false);
    const links = useRef([{
        href: '/val/en',
        label: t('nav.english'),
        title: t('nav.english_link_description'),
    }, {
        href: '/val/es',
        label: t('nav.spanish'),
        title: t('nav.spanish_link_description'),
    }]);

    function toggleLanguageMenu() {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);

        if (newIsOpen) {
            menuRef.current?.focus();
        }
    }

    const handleClickOutside = useCallback((event: MouseEvent) => {
        const clickedElement = event.target as HTMLElement;
        const userClickedAway = ![menuRef, buttonRef].some(({ current }) => current?.contains(clickedElement));

        if (userClickedAway) {
            setIsOpen(false);
        }
    }, []);
    // use ref to keep a stable function reference between renders, so the document event handler can be added and removed
    clickawayHandlerRef.current = handleClickOutside;

    useEffect(() => {
        const unregisterDocumentClickawayListener = () => {
            if (documentHasClickawayListener.current && clickawayHandlerRef.current) {
                document.removeEventListener('mousedown', clickawayHandlerRef.current);
                documentHasClickawayListener.current = false;
            }
        };

        if (isOpen) {
            if (!documentHasClickawayListener.current && clickawayHandlerRef.current) {
                document.addEventListener('mousedown', clickawayHandlerRef.current);
                documentHasClickawayListener.current = true;
            }
        } else {
            unregisterDocumentClickawayListener();
        }

        return () => {
            unregisterDocumentClickawayListener();
        };
    }, [isOpen]);

    return (<>
        <button
            ref={buttonRef}
            id="language-switcher-button"
            data-testid="language-switcher-button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls="language-switcher-popup"
            aria-label={t('nav.language_button_label')}
            className="h-8 w-8 flex justify-center items-center rounded-full shadow-lg hover:border-[2px] border-[1px] border-amber-900 bg-amber-50 dark:bg-stone-950 dark:border-orange-300"
            onClick={toggleLanguageMenu}
        >
            <MdLanguage className="text-amber-900 dark:text-orange-300 h-5 w-5" aria-hidden="true" />
        </button>

        <menu
            ref={menuRef}
            id="language-switcher-popup"
            data-testid="language-switcher-popup"
            role="region"
            aria-label={t('nav.language_popup_label')}
            hidden={!isOpen}
            aria-hidden={!isOpen}
            className="absolute bottom-12 shadow-lg p-3 bg-amber-50 border-[1px] border-amber-900 rounded-sm dark:bg-stone-950 dark:border-orange-300"
        >
            {links.current.map(({ href, label, title }) => (
                <li key={title} className="flex items-center gap-2" role="menuitem">
                    <Link
                        href={href}
                        title={title}
                        aria-current={href === path ? 'page' : undefined}
                        className={`${href=== path ? 'font-bold' : ''} text-amber-900 dark:text-orange-300 hover:underline`}
                    >
                        {label}
                    </Link>
                </li>
            ))}
        </menu>
    </>);
}
