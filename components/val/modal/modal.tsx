import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { MdClose } from 'react-icons/md';

import { useI18n } from '@/hooks/useI18n';

export type ModalExposedMethods = {
    toggleModal: (shouldBeVisible: boolean) => void;
};
export type ModalProps = {
    description: string;
    title: string;
    subtitle: string;
    trigger: React.ReactNode;
    footer?: React.ReactNode;
    ref: React.Ref<ModalExposedMethods>;
};

const dialogDimensionalClasses = 'w-[90vw] max-w-[1000px] min-h-[40vh] max-h-[80vh] md:max-h-[600px]';
const focusableElementsString = `
    a[href],
    area[href],
    audio,
    input:not([disabled]),
    select:not([disabled]),
    textarea:not([disabled]),
    button:not([disabled]),
    iframe, object, embed,
    [tabindex]:not([tabindex="-1"]),
    [contenteditable]
`;

type ClickListener = (event: MouseEvent) => void;
type KeydownListener = (event: KeyboardEvent) => void;

export default function Modal({
    children,
    description,
    title,
    subtitle,
    trigger,
    footer,
    ref,
}: React.PropsWithChildren<ModalProps>) {
    const [modalIsVisible, setModalIsVisible] = useState(false);

    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const dialogInnerRef = useRef<HTMLDivElement | null>(null);
    const footerElementRef = useRef<HTMLDivElement | null>(null);
    const handleClickOutsideFnRef = useRef<ClickListener | null>(null);
    const handleKeydownFnRef = useRef <KeydownListener | null>(null);
    const documentHasClickawayListener = useRef(false);
    const documentHasKeydownListener = useRef(false);

    useImperativeHandle(ref, () => ({
        toggleModal: (visible) => setModalIsVisible(visible)
    }), [setModalIsVisible]);

    const { t } = useI18n();

    function cleanupListeners() {
        if (documentHasClickawayListener.current) {
            document.removeEventListener('mousedown', handleClickOutsideFnRef.current!);
            documentHasClickawayListener.current = false;
        }

        if (documentHasKeydownListener.current) {
            document.removeEventListener('keydown', handleKeydownFnRef.current!);
            documentHasKeydownListener.current = false;
        }
    }

    const handleClickOutside = useCallback((event: MouseEvent) => {
        const clickedElement = event.target as HTMLElement;
        const userClickedAway = !dialogInnerRef.current!.contains(clickedElement);

        if (userClickedAway) {
            setModalIsVisible(false);
        }
    }, []);
    handleClickOutsideFnRef.current = handleClickOutside;

    const handleKeydown = useCallback((event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
            return;
        }

        // Get focusable elements
        const focusableElementsInDialog = Array.from(dialogRef.current?.querySelectorAll(focusableElementsString) ?? []);
        const focusableElementsInDocument = Array.from(document.querySelectorAll(focusableElementsString));
        const firstFocusableInDialog = focusableElementsInDialog[0] as HTMLElement;
        const lastFocusableInDialog = focusableElementsInDialog[focusableElementsInDialog.length - 1] as HTMLElement;
        const firstFocusableInDocument = focusableElementsInDocument[0] as HTMLElement;
        const lastFocusableInDocument = focusableElementsInDocument[focusableElementsInDialog.length - 1] as HTMLElement;

        if (event.shiftKey) {
            if (document.activeElement === firstFocusableInDocument) {
                firstFocusableInDialog.focus();
            } else if (document.activeElement === firstFocusableInDialog) {
                lastFocusableInDialog.focus();
            }

            event.preventDefault();
            return;
        }

        if (document.activeElement === firstFocusableInDocument) {
            firstFocusableInDialog.focus();
            event.preventDefault();
        } else if (document.activeElement === lastFocusableInDialog) {
            lastFocusableInDocument.focus();
            // don't prevent default so the focus actually leaves the viewport,
            // so the user can interact with the browser UI via keyboard
        }
    }, []);
    handleKeydownFnRef.current = handleKeydown;

    useEffect(() => {
        const dialog = dialogRef.current;

        const handleDialogClose = () => {
            setModalIsVisible(false);
        };
        // clean up event listeners and styles if user closes via ESC key
        dialog?.addEventListener('close', handleDialogClose);

        return () => {
            dialog?.removeEventListener('close', handleDialogClose);
            cleanupListeners();
        };
    }, []);

    useEffect(() => {
        function handleModalVisibilityChange(visible: boolean) {
            if (visible) {
                if (!documentHasClickawayListener.current) {
                    document.addEventListener('mousedown', handleClickOutsideFnRef.current!);
                    documentHasClickawayListener.current = true;
                }

                if (!documentHasKeydownListener.current) {
                    document.addEventListener('keydown', handleKeydownFnRef.current!);
                    documentHasKeydownListener.current = true;
                }

                dialogRef.current?.showModal();
                document.body.setAttribute('inert', 'true');
                document.body.style.overflow = 'hidden';
                document.body.style.filter = 'blur(2px)';
            } else {
                cleanupListeners();

                dialogRef.current?.close();
                document.body.removeAttribute('inert');
                document.body.style.overflow = '';
                document.body.style.filter = '';
            }
        }

        handleModalVisibilityChange(modalIsVisible);

        if (footerElementRef.current) {
            // if the footer is visible, add extra padding to the bottom of the dialog content so it doesn't get cut off
            dialogRef.current?.style.setProperty('--extra-margin-bottom', `${footerElementRef.current.offsetHeight}px`);
        }
    }, [modalIsVisible]);

    return (<>
        <div
            role="button"
            aria-haspopup="dialog"
            aria-expanded={modalIsVisible}
            tabIndex={0}
            title={description}
            data-testid="modal-trigger"
            onClick={() => setModalIsVisible(true)}
            onKeyDown={(event) => {
                if([' ', 'Enter'].includes(event.key)) {
                    event.preventDefault();
                    setModalIsVisible(true);
                }
            }}
        >
            {trigger}
        </div>

        <dialog
            ref={dialogRef}
            aria-modal="true"
            className={`${modalIsVisible ? 'flex' : ''} ${dialogDimensionalClasses} m-auto h-max fixed top-0 right-0 bottom-0 left-0 items-center justify-center overflow-hidden bg-transparent backdrop:bg-black backdrop:opacity-90`}
        >
            <div className={`relative ${dialogDimensionalClasses} rounded-sm overflow-hidden flex h-max`}>
                <div ref={dialogInnerRef} className="relative w-full flex flex-col bg-white dark:bg-stone-950 dark:text-amber-50">
                    <header className="sticky top-0 left-0 right-0 shadow-sm flex justify-between items-center bg-amber-50 dark:bg-stone-950">
                        <div className="ml-4 my-2 dark:text-amber-50">
                            <h1 className="font-header">
                                {title}
                            </h1>
                            <p className="text-xs italic">
                                {subtitle}
                            </p>
                        </div>

                        <button
                            className="h-8 w-8 m-4 flex items-center justify-center shrink-0 rounded-full border-[1px] border-amber-900 hover:border-[2px] dark:border-orange-300"
                            data-testid="modal-close-button"
                            title={`${t('modal.close_modal_label')} ${title}`}
                            aria-label={`${t('modal.close_modal_label')} ${title}`}
                            onClick={() => setModalIsVisible(false)}
                        >
                            <MdClose className="text-xl text-amber-900 dark:text-orange-300" aria-hidden="true" />
                        </button>
                    </header>

                    <div className="p-4 lg:p-8 overflow-y-auto dark:bg-stone-900 h-[calc(100% - 4rem)] border-b-(length:--extra-margin-bottom) border-b-transparent">
                        {children}
                    </div>

                    {footer && (
                        <footer
                            ref={footerElementRef}
                            className="absolute bottom-0 left-0 right-0 p-2 flex justify-center items-center shadow-sm bg-amber-50 dark:bg-stone-950"
                        >
                            {footer}
                        </footer>
                    )}
                </div>
            </div>
        </dialog>
    </>);
}
