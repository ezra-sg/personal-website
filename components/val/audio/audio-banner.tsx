import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MdReadMore } from 'react-icons/md';

import { useI18n } from '@/hooks/useI18n';
import { AudioStatus, useAudioContext } from '@/hooks/useAudioContext';
import useScrollDirection, { ScrollDirection } from '@/hooks/useScrollDirection';
import cn from '@/utils/cn';

import GlobalAudioPlayer from '@/components/val/audio/global-audio-player';
import Modal from '@/components/val/modal/modal';

enum BannerState {
    visible = 'visible',
    markedForRemoval = 'markedForRemoval',
    hidden = 'hidden'
}

export default function AudioBanner() {
    const [bannerState, setBannerState] = useState<BannerState>(BannerState.hidden);

    const { t } = useI18n();

    const {
        audioPlaybackState,
        currentAudioData,
    } = useAudioContext();

    const scrollDirection = useScrollDirection();

    const stopPlaybackHandler = useCallback(() => {
        setBannerState(BannerState.hidden);
    }, []);

    const modalTrigger = useMemo(() => (
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
    ), [t]);

    const modalFooter = useMemo(() => (
        <div className="w-max m-auto min-w-0">
            <GlobalAudioPlayer labelledBy="audio-banner-title" modalMode={true} manualStopHandler={stopPlaybackHandler} />
        </div>
    ), [stopPlaybackHandler]);

    const bannerClasses = cn(
        'fixed right-0 left-0 h-fit py-2 px-4 bg-amber-50 shadow-sm z-50 items-center justify-center flex-col duration-300 dark:bg-stone-950',
        '[transition:translate_0.4s_ease_allow-discrete,display_0.1s_ease_0.4s_allow-discrete]',
        bannerState === BannerState.hidden ? 'hidden translate-y-[-100%]' : 'flex translate-y-0'
    );

    useEffect(() => {
        const shouldHideDueToScroll =
            scrollDirection === ScrollDirection.down &&
            bannerState === BannerState.markedForRemoval;

        const shouldMakeVisible =
            [AudioStatus.playing, AudioStatus.paused].includes(audioPlaybackState) &&
            bannerState !== BannerState.visible;

        const shouldMarkForScrollRemoval =
            scrollDirection === ScrollDirection.none &&
            audioPlaybackState === AudioStatus.stopped &&
            ![BannerState.hidden, BannerState.markedForRemoval].includes(bannerState);

        if (shouldHideDueToScroll) {
            setBannerState(BannerState.hidden);
        } else if (shouldMakeVisible) {
            setBannerState(BannerState.visible);
        } else if (shouldMarkForScrollRemoval) {
            setBannerState(BannerState.markedForRemoval);
        }
    }, [scrollDirection, audioPlaybackState, bannerState]);

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
