import {
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    MdPlayCircleOutline,
    MdOutlinePauseCircleOutline,
    MdSpeed,
    MdOutlineStopCircle,
    MdRestartAlt,
} from 'react-icons/md';

import cn from '@/utils/cn';
import { useI18n } from '@/hooks/useI18n';
import { AudioStatus, useAudioContext } from '@/hooks/useAudioContext';
import { prettyPrintTimestamp } from '@/utils/text-utils';

export type AudioPlayerProps = {
    labelledBy: string; // the id of the element which describes the audio
    modalMode: boolean; // determines whether the component uses the <audio> element from the context or its own
    manualStopHandler?: () => void;
};

// tailwind only detects classes if they are stated in source code; instead of generating classes with
// the vendor prefixes programmatically, they must be explicitly listed here
const scrubberClasses = cn(
    'min-w-0 appearance-none',

    // track styles - webkit
    '[&::-webkit-slider-runnable-track]:bg-stone-500',
    '[&::-webkit-slider-runnable-track]:h-[2px]',
    '[&::-webkit-slider-runnable-track]:cursor-pointer',
    'dark:[&::-webkit-slider-runnable-track]:bg-white',

    // track styles - firefox
    '[&::-moz-range-track]:bg-stone-500',
    '[&::-moz-range-track]:h-[2px]',
    '[&::-moz-range-track]:cursor-pointer',
    'dark:[&::-moz-range-track]:bg-white',

    // thumb styles - webkit
    '[&::-webkit-slider-thumb]:appearance-none',
    '[&::-webkit-slider-thumb]:[-webkit-appearance: none]',
    '[&::-webkit-slider-thumb]:bg-amber-900',
    '[&::-webkit-slider-thumb]:w-[6px]',
    '[&::-webkit-slider-thumb]:h-[15px]',
    '[&::-webkit-slider-thumb]:shadow-md',
    '[&::-webkit-slider-thumb]:rounded-xs',
    '[&::-webkit-slider-thumb]:mt-[-7px]',
    '[&::-webkit-slider-thumb]:cursor-pointer',
    'dark:[&::-webkit-slider-thumb]:bg-orange-300',

    // thumb styles - firefox
    '[&::-moz-range-thumb]:appearance-none',
    '[&::-moz-range-thumb]:bg-amber-900',
    '[&::-moz-range-thumb]:w-[6px]',
    '[&::-moz-range-thumb]:h-[15px]',
    '[&::-moz-range-thumb]:shadow-md',
    '[&::-moz-range-thumb]:rounded-xs',
    '[&::-moz-range-thumb]:mt-[-7px]',
    '[&::-moz-range-thumb]:cursor-pointer',
    'dark:[&::-moz-range-thumb]:bg-orange-300',
);

export const playbackSpeedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];

const GlobalAudioPlayer = memo(({ labelledBy, modalMode, manualStopHandler }: AudioPlayerProps) => {
    const [showPlaybackSpeedOptions, setShowSpeedOptions] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showRestartIcon, setShowRestartIcon] = useState(false);
    const [audioTime, setAudioTime] = useState(0);
    const [totalAudioTime, setTotalAudioTime] = useState(0);

    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const scrubberElementRef = useRef<HTMLInputElement | null>(null);
    const playbackSpeedMenuRef = useRef<HTMLUListElement | null>(null);
    const playbackSpeedButtonRef = useRef<HTMLButtonElement | null>(null);
    const playbackSpeedClickawayHandlerRef = useRef<null | ((event: MouseEvent) => void)>(null);
    const documentHasClickawayListener = useRef(false);
    const isLoaded = useRef(false);
    const audioId = useRef<string | null>(null);
    const setStateToStoppedTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { t } = useI18n();

    const {
        currentAudioData,
        audioPlaybackState,
        setAudioElementRef,
        setAudioStatus,
        audioElement,
    } = useAudioContext();

    const isPlaying = audioPlaybackState === AudioStatus.playing;

    const playButtonAriaLabel = `${
        showRestartIcon ? t('audio.restart_audio_aria') : t(`inputs.${isPlaying ? 'pause' : 'play'}_audio_aria`)
    } ${currentAudioData.title}`;

    const audioTimePretty = prettyPrintTimestamp(audioTime);
    const totalAudioTimePretty = prettyPrintTimestamp(totalAudioTime);

    const handlePlaybackSpeedClickaway = useCallback((event: MouseEvent) => {
        const clickedElement = event.target as HTMLElement;
        const userClickedAway = ![playbackSpeedMenuRef, playbackSpeedButtonRef].some(({ current }) => current!.contains(clickedElement));

        if (userClickedAway) {
            setShowSpeedOptions(false);
        }
    }, []);
    playbackSpeedClickawayHandlerRef.current = handlePlaybackSpeedClickaway;

    useEffect(() => {
        const scrubberElement = scrubberElementRef.current!;

        if (!audioElement) {
            return;
        }

        const handleAudioMetaLoaded = () => {
            scrubberElement.max = audioElement.duration.toString();
            setTotalAudioTime(audioElement.duration);
        };

        const handleAudioTimeUpdate = () => {
            scrubberElement.value = audioElement.currentTime.toString();
            setAudioTime(audioElement.currentTime);
        };

        const updateAudioPosition = () => {
            audioElement.currentTime = Number(scrubberElement.value);
        };

        if (audioElement.readyState >= 1) {
            handleAudioMetaLoaded();
        } else {
            audioElement.addEventListener('loadedmetadata', handleAudioMetaLoaded);
        }
        audioElement.addEventListener('timeupdate', handleAudioTimeUpdate);
        scrubberElement.addEventListener('input', updateAudioPosition);

        return () => {
            audioElement.removeEventListener('loadedmetadata', handleAudioMetaLoaded);
            audioElement.removeEventListener('timeupdate', handleAudioTimeUpdate);
            scrubberElement.removeEventListener('input', updateAudioPosition);
        };
    }, [audioElement]);

    useEffect(() => {
        if (!modalMode && audioElement !== audioElementRef.current) {
            setAudioElementRef(audioElementRef.current);
        }
    }, [setAudioElementRef, audioElement, modalMode]);

    useEffect(() => {
        if (!audioElement) {
            return;
        }

        if (audioId.current !== currentAudioData.snippetId) {
            audioId.current = currentAudioData.snippetId;

            audioElement.src = currentAudioData.src ?? '';
            isLoaded.current = false;
            audioElement.load();
        }
    }, [audioElement, currentAudioData]);

    useEffect(() => {
        if (!audioElement) {
            return;
        }

        if (setStateToStoppedTimeoutId.current) {
            clearTimeout(setStateToStoppedTimeoutId.current);
            setStateToStoppedTimeoutId.current = null;
        }

        if (audioPlaybackState === AudioStatus.playing) {
            if (audioElement.currentTime === audioElement.duration) {
                // restart audio
                audioElement.currentTime = 0;
            }
            if (isLoaded.current) {
                // if it's not loaded, defer playing to the onLoad event handler on the audio element
                audioElement.play();
            }
        } else if (audioPlaybackState === AudioStatus.paused) {
            audioElement.pause();
        } else if (audioPlaybackState === AudioStatus.stopped) {
            audioElement.pause();
            audioElement.currentTime = 0;
        } else if (audioPlaybackState === AudioStatus.complete) {
            setStateToStoppedTimeoutId.current = setTimeout(() => {
                setAudioStatus(AudioStatus.stopped, currentAudioData.snippetId);
            }, 3000);
        }

    }, [audioElement, audioPlaybackState, setAudioStatus, currentAudioData]);

    useEffect(() => {
        const unregisterDocumentClickawayListener = () => {
            if (documentHasClickawayListener.current) {
                document.removeEventListener('mousedown', playbackSpeedClickawayHandlerRef.current!);
                documentHasClickawayListener.current = false;
            }
        };

        if (showPlaybackSpeedOptions) {
            if (!documentHasClickawayListener.current) {
                document.addEventListener('mousedown', playbackSpeedClickawayHandlerRef.current!);
                documentHasClickawayListener.current = true;
            }
        } else {
            unregisterDocumentClickawayListener();
        }

        return () => {
            unregisterDocumentClickawayListener();
        };
    }, [showPlaybackSpeedOptions]);

    return (<>
        <div className="flex items-center gap-2 text-2xl w-full text-amber-900 dark:text-orange-300">
            {/* play/pause button */}
            <button
                onClick={() => {
                    const newAudioStatus = isPlaying ? AudioStatus.paused : AudioStatus.playing;
                    setAudioStatus(newAudioStatus, currentAudioData.snippetId);
                    setShowRestartIcon(false);
                }}
                onKeyDown={(event) => {
                    if([' ', 'Enter'].includes(event.key)) {
                        event.preventDefault();
                        const newAudioStatus = isPlaying ? AudioStatus.paused : AudioStatus.playing;
                        setAudioStatus(newAudioStatus, currentAudioData.snippetId);
                        setShowRestartIcon(false);
                    }
                }}
                aria-label={playButtonAriaLabel}
                title={playButtonAriaLabel}
                className="h-10 w-10 flex items-center justify-center shrink-0"
                data-testid="audio-player-play-button"
            >
                {
                    isPlaying ?
                        <MdOutlinePauseCircleOutline aria-hidden= "true" /> :
                        (showRestartIcon ? <MdRestartAlt aria-hidden="true" /> : <MdPlayCircleOutline aria-hidden="true" />)
                }
            </button>

            {/* time elapsed */}
            <code className="text-xs" title={`${t('audio.audio_time_elapsed_title')} ${currentAudioData.title}`}>
                {audioTimePretty}
            </code>

            {/* audio scrubber */}
            <input
                ref={scrubberElementRef}
                type="range"
                min="0"
                step="0.1"
                defaultValue={0}
                aria-label={`${t('audio.audio_scrubber_aria')} ${currentAudioData.title}`}
                className={scrubberClasses}
            />

            {/* total audio time */}
            <code className="text-xs" title={`${t('audio.audio_time_total_title')} ${currentAudioData.title}`}>
                {totalAudioTimePretty}
            </code>

            {/* audio speed controls */}
            <div className="relative">
                <button
                    ref={playbackSpeedButtonRef}
                    aria-label={`${t('audio.change_playback_speed_aria')} ${currentAudioData.title}`}
                    title={`${t('audio.change_playback_speed_aria')} ${currentAudioData.title}`}
                    data-testid="audio-player-speed-button"
                    onClick={() => setShowSpeedOptions(!showPlaybackSpeedOptions)}
                    onKeyDown={(event) => {
                        if ([' ', 'Enter'].includes(event.key)) {
                            event.preventDefault();
                            setShowSpeedOptions(!showPlaybackSpeedOptions);
                        }
                    }}
                    className="h-10 w-10 flex items-center justify-center shrink-0"
                >
                    <MdSpeed aria-hidden="true" />
                </button>

                <ul
                    ref={playbackSpeedMenuRef}
                    role="menu"
                    className={`${modalMode ? '-top-60' : ''} absolute -left-12 p-3 bg-amber-50 shadow-lg rounded-sm border-[1px] border-amber-900 dark:bg-stone-950 dark:border-orange-300`}
                    hidden={!showPlaybackSpeedOptions}
                    aria-hidden={!showPlaybackSpeedOptions}
                    aria-label={`${t('audio.audio_speed_menu_label')} ${currentAudioData.title}`}
                    data-testid="audio-player-speed-menu"
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            setShowSpeedOptions(false);
                        }
                    }}
                >
                    {playbackSpeedOptions.map((speed, index) => (
                        <li
                            key={`audio-speed-label-${labelledBy}-${index}`}
                            role="menuitemradio"
                            aria-checked={playbackSpeed === speed}
                            tabIndex={0}
                            aria-label={`${t('audio.audio_speed_item_label')} ${speed}`}
                            className={`${playbackSpeed === speed ? 'font-bold' : ''} text-sm cursor-pointer my-2 hover:underline`}
                            data-testid={`audio-player-speed-option-${index}`}
                            onClick={() => {
                                if (audioElement) {
                                    audioElement.playbackRate = speed;
                                }
                                setPlaybackSpeed(speed);
                                setShowSpeedOptions(false);
                            }}
                            onKeyDown={(event) => {
                                if ([' ', 'Enter'].includes(event.key)) {
                                    event.preventDefault();
                                    if (audioElement) {
                                        audioElement.playbackRate = speed;
                                    }
                                    setPlaybackSpeed(speed);
                                    setShowSpeedOptions(false);
                                }
                            }}
                        >
                            {speed === 1 ? t('global.normal') : `${speed}x`}
                        </li>
                    ))}
                </ul>
            </div>

            {/* stop button */}
            <button
                onClick={() => {
                    setAudioStatus(AudioStatus.stopped, currentAudioData.snippetId);
                    setShowRestartIcon(false);
                    manualStopHandler?.();
                }}
                onKeyDown={(event) => {
                    if ([' ', 'Enter'].includes(event.key)) {
                        event.preventDefault();
                        setAudioStatus(AudioStatus.stopped, currentAudioData.snippetId);
                        setShowRestartIcon(false);
                        manualStopHandler?.();
                    }
                }}
                aria-label={`${t('audio.stop_audio_aria')} ${currentAudioData.title}`}
                title={`${t('audio.stop_audio_aria')} ${currentAudioData.title}`}
                className="h-10 w-10 flex items-center justify-center shrink-0"
                data-testid="audio-player-stop-button"
            >
                <MdOutlineStopCircle aria-hidden="true" />
            </button>
        </div>

        {!modalMode && (
            <audio
                ref={audioElementRef}
                controls
                src={currentAudioData.src ?? undefined}
                aria-labelledby={labelledBy}
                hidden
                data-testid="audio-player-audio-element"
                onEnded={() => {
                    setAudioStatus(AudioStatus.complete, currentAudioData.snippetId);
                    setShowRestartIcon(true);
                }}
                onLoadStart={() => {
                    isLoaded.current = false;
                }}
                onLoadedMetadata={() => {
                    isLoaded.current = true;

                    if (isPlaying) {
                        audioElement?.play();
                    }
                }}
            />
        )}
    </>);
});

export default GlobalAudioPlayer;
