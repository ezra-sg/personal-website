'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Young_Serif, Nunito_Sans } from 'next/font/google';

import { AudioProvider } from '@/hooks/useAudioContext';
import { useI18n } from '@/hooks/useI18n';

import Hero from '@/components/val/hero/hero';

const AudioBanner     = lazy(() => import('@/components/val/audio/audio-banner'));
const SectionZero     = lazy(() => import('@/components/val/sections/section-0'));
const SectionOne      = lazy(() => import('@/components/val/sections/section-1'));
const SectionTwo      = lazy(() => import('@/components/val/sections/section-2'));
const SectionThree    = lazy(() => import('@/components/val/sections/section-3'));
const SectionFour     = lazy(() => import('@/components/val/sections/section-4'));
const SectionFive     = lazy(() => import('@/components/val/sections/section-5'));
const ProgressTracker = lazy(() => import('@/components/val/progress-tracker/progress-tracker'));

const youngSerif = Young_Serif({
    weight: '400',
    subsets: ['latin-ext'],
    variable: '--font-young-serif',
    preload: true,
});

const poppins = Nunito_Sans({
    weight: '400',
    subsets: ['latin-ext'],
    variable: '--font-nunito',
    preload: true,
});

export default function ValHome() {
    const [renderInteractiveComponents, setRenderInteractiveComponents] = useState(false);
    const [renderSectionOne, setRenderSectionOne]     = useState(false);
    const [renderSectionTwo, setRenderSectionTwo]     = useState(false);
    const [renderSectionThree, setRenderSectionThree] = useState(false);
    const [renderSectionFour, setRenderSectionFour]   = useState(false);
    const [renderSectionFive, setRenderSectionFive]   = useState(false);

    const scrollListenerRegistered = useRef(false);
    const sectionOneRef   = useRef<HTMLElement>(null);
    const sectionTwoRef   = useRef<HTMLElement>(null);
    const sectionThreeRef = useRef<HTMLElement>(null);
    const sectionFourRef  = useRef<HTMLElement>(null);
    const sectionFiveRef  = useRef<HTMLElement>(null);

    const { t } = useI18n();

    const sectionFallback = <div className="w-full h-[200vh]"></div>;

    const sectionData = [{
        ref: sectionOneRef,
        shouldRender: renderSectionOne,
        Component: SectionOne,
    }, {
        ref: sectionTwoRef,
        shouldRender: renderSectionTwo,
        Component: SectionTwo,
    }, {
        ref: sectionThreeRef,
        shouldRender: renderSectionThree,
        Component: SectionThree,
    }, {
        ref: sectionFourRef,
        shouldRender: renderSectionFour,
        Component: SectionFour,
    }, {
        ref: sectionFiveRef,
        shouldRender: renderSectionFive,
        Component: SectionFive,
    }];

    function handleSkipLinkClick() {
        setRenderSectionOne(true);
        setRenderSectionTwo(true);
        setRenderSectionThree(true);
        setRenderSectionFour(true);
        setRenderSectionFive(true);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === sectionOneRef.current) {
                        setRenderSectionOne(isRendered => isRendered || entry.isIntersecting);
                    } else if (entry.target === sectionTwoRef.current) {
                        setRenderSectionTwo(isRendered => isRendered || entry.isIntersecting);
                    } else if (entry.target === sectionThreeRef.current) {
                        setRenderSectionThree(isRendered => isRendered || entry.isIntersecting);
                    } else if (entry.target === sectionFourRef.current) {
                        setRenderSectionFour(isRendered => isRendered || entry.isIntersecting);
                    } else if (entry.target === sectionFiveRef.current) {
                        setRenderSectionFive(isRendered => isRendered || entry.isIntersecting);
                    }
                });
            },
            { rootMargin: '1000px', threshold: 0.1 }
        );

        // Observe the placeholders
        [sectionOneRef, sectionTwoRef, sectionThreeRef, sectionFourRef, sectionFiveRef].forEach((ref) => {
            if (!!ref.current) {
                observer.observe(ref.current);
            }
        });

        // Register a scroll listener to render the interactive components
        const scrollHandler = () => {
            setRenderInteractiveComponents(true);
            document.removeEventListener('scroll', scrollHandler);
            scrollListenerRegistered.current = false;
        };

        document.addEventListener('scroll', scrollHandler);
        scrollListenerRegistered.current = true;

        if (window.scrollY > 0) {
            scrollHandler();
        }

        return () => {
            observer.disconnect();

            if (scrollListenerRegistered.current) {
                document.removeEventListener('scroll', scrollHandler);
                scrollListenerRegistered.current = false;
            }
        };
    }, []);

    return (<>
        <a
            href="#section-zero"
            className="fixed -top-96 left-0 right-0 z-50 text-center underline bg-amber-50 text-amber-900 dark:text-orange-300 dark:bg-stone-950 focus-within:top-0"
            onClick={handleSkipLinkClick}
            onKeyDown={(e) => {
                if (['Enter', 'Space'].includes(e.code)) {
                    handleSkipLinkClick();
                }
            }}
        >
            {t('accessibility.skip_to_content')}
        </a>
        <div className={`bg-amber-50 dark:bg-stone-950 w-[100svw] min-h-[100svh] max-w-full ${youngSerif.variable} ${poppins.variable}`}>
            <AudioProvider>
                <Suspense fallback={null}>
                    {renderInteractiveComponents && <AudioBanner />}
                </Suspense>

                <article>
                    <section>
                        <Hero />
                    </section>

                    <section id="section-zero">
                        <SectionZero />
                    </section>

                    {sectionData.map(({ ref, shouldRender, Component }, index) => (
                        <section key={`home-section-${index}`} ref={ref} aria-live="polite">
                            {!shouldRender && sectionFallback}

                            <Suspense fallback={sectionFallback}>
                                {shouldRender && (
                                    <Component />
                                )}
                            </Suspense>
                        </section>
                    ))}
                </article>

                <Suspense fallback={null}>
                    {renderInteractiveComponents && (
                        <ProgressTracker
                            sectionOneRef={sectionOneRef}
                            sectionTwoRef={sectionTwoRef}
                            sectionThreeRef={sectionThreeRef}
                            sectionFourRef={sectionFourRef}
                            sectionFiveRef={sectionFiveRef}
                        />
                    )}
                </Suspense>
            </AudioProvider>
        </div>
    </>);
}
