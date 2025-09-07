import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MdReadMore } from 'react-icons/md';

import { useI18n } from '@/hooks/useI18n';
import { AudioStatus, useAudioContext } from '@/hooks/useAudioContext';
import useScrollDirection, { ScrollDirection } from '@/hooks/useScrollDirection';

import throttle from '@/utils/throttle';

import GlobalAudioPlayer from '@/components/val/audio/global-audio-player';
import Modal from '@/components/val/modal/modal';

import './audio-banner.scss';
import cn from '@/utils/cn';

// const Modal = lazy(() => import('@/components/val/modal/modal'));

enum BannerState {
    visible = 'visible',
    markedForRemoval = 'marked-for-removal',
    hidden = 'hidden'
}

export default function AudioBanner() {
    // const [markedForRemoval, setMarkedForRemoval] = useState(false);
    // const [isHidden, setIsHidden] = useState(true);
    // const [isRemoving, setIsRemoving] = useState(false);
    // const [modalInitiallyRendered, setModalInitiallyRendered] = useState(false);
    // const lastScrollTop = useRef(0);
    // const shouldHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // const [isVisible, setIsVisible] = useState<BannerVisibility>(BannerVisibility.hidden)
    // const [markedForRemoval, setMarkedForRemoval] = useState(false);

    const [bannerState, setBannerState] = useState<BannerState>(BannerState.hidden);

    const { t } = useI18n();

    const {
        audioPlaybackState,
        currentAudioData,
    } = useAudioContext();

    const scrollDirection = useScrollDirection();
    console.log(scrollDirection);

    if (scrollDirection === ScrollDirection.down && bannerState === BannerState.markedForRemoval) {
        console.log(1);
        setBannerState(BannerState.hidden);
    } else if (
        [AudioStatus.playing, AudioStatus.paused].includes(audioPlaybackState) && bannerState !== BannerState.visible
    ) {
        console.log(2);

        setBannerState(BannerState.visible);
    } else if (scrollDirection === ScrollDirection.none && audioPlaybackState === AudioStatus.stopped && bannerState !== BannerState.hidden && bannerState !== BannerState.markedForRemoval) {
        console.log(3);

        setBannerState(BannerState.markedForRemoval);
    }
    // else if (bannerState !== BannerState.hidden && scrollDirection !== ScrollDirection.up) {
    //     console.log(4);

    //     setBannerState(BannerState.hidden);
    // }

    const stopPlaybackHandler = useCallback(() => {
        setBannerState(BannerState.hidden);
    }, []);



    const modalTrigger = (
        <div
            role="button"
            tabIndex={0}
            className="flex gap-2 items-center justify-center cursor-pointer text-amber-900 dark:text-orange-300"
        >
            <MdReadMore aria-hidden={true} />

            <div className="text-xs">
                <ReactMarkdown>
                    {t('audio.view_transcript_md')}
                </ReactMarkdown>
            </div>
        </div>
    );

    // const removeBanner = useCallback(() => {
    //     setIsRemoving(true);

    //     if (!shouldHideTimeoutRef.current) {
    //         shouldHideTimeoutRef.current = setTimeout(() => {
    //             setIsHidden(true);
    //             shouldHideTimeoutRef.current = null;
    //         }, 500);
    //     }
    // }, []);

    const modalFooter = (
        <div className="w-max m-auto min-w-0">
            <GlobalAudioPlayer labelledBy="audio-banner-title" modalMode={true} manualStopHandler={stopPlaybackHandler} />
        </div>
    );

    // useEffect(() => {
    //     const scrollHandler = throttle(() => {
    //         let scrollTop = window.scrollY || document.documentElement.scrollTop;
    //         const userScrolledDown = scrollTop > lastScrollTop.current;

    //         // Update last scroll position
    //         lastScrollTop.current = scrollTop;

    //         if (userScrolledDown && markedForRemoval) {
    //             removeBanner();
    //         } else if (shouldHideTimeoutRef.current) {
    //             clearTimeout(shouldHideTimeoutRef.current);
    //             shouldHideTimeoutRef.current = null;
    //         }
    //     }, 100);

    //     scrollHandler();

    //     document.addEventListener('scroll', scrollHandler);

    //     return () => {
    //         document.removeEventListener('scroll', scrollHandler);

    //         if (shouldHideTimeoutRef.current) {
    //             clearTimeout(shouldHideTimeoutRef.current);
    //             shouldHideTimeoutRef.current = null;
    //         }
    //     };
    // }, [markedForRemoval, removeBanner]);

    // useEffect(() => {
    //     if (audioPlaybackState !== AudioStatus.stopped) {
    //         setIsRemoving(false);
    //         setIsHidden(false);
    //         setModalInitiallyRendered(true);
    //     }

    //     setMarkedForRemoval(audioPlaybackState === AudioStatus.stopped);
    // }, [audioPlaybackState]);

    const bannerClasses = cn(
        'fixed right-0 left-0 h-fit py-2 px-4 bg-amber-50 shadow-sm z-50 items-center justify-center flex-col transition-all duration-300 dark:bg-stone-950',
        'c-audio-banner',
        bannerState === BannerState.hidden && 'c-audio-banner--hidden'
    );

    return (
        <div
            role="region"
            className={bannerClasses}
            inert={bannerState === BannerState.hidden}
            aria-label={t('audio.audio_banner_aria')}
        >
            <h3 id="audio-banner-title" className="font-header text-sm dark:text-white">
                {currentAudioData.title}
            </h3>

            <div className="max-w-lg m-auto">
                <GlobalAudioPlayer labelledBy="audio-banner-title" modalMode={false} manualStopHandler={stopPlaybackHandler} />
            </div>

            {/* eztodo make suspense / async */}
            <Modal
                trigger={modalTrigger}
                description={`${t('audio.open_transcript_modal')} ${currentAudioData.title}`}
                title={currentAudioData.title ?? ''}
                subtitle={t('audio.audio_transcript')}
                footer={modalFooter}
            >
                <ReactMarkdown>
                    {currentAudioData.transcript ?? ''}
                </ReactMarkdown>
            </Modal>

        </div>
    );
}
