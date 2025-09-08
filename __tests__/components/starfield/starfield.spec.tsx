import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupJestCanvasMock } from 'jest-canvas-mock';

import * as nextNavigation from 'next/navigation';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

import Starfield from '@/components/starfield/starfield';

jest.mock('next/navigation');
const mockedNextNavigation = jest.mocked(nextNavigation);

jest.mock('@/hooks/usePrefersReducedMotion');
const mockedUsePrefersReducedMotion = jest.mocked(usePrefersReducedMotion);

describe('<Starfield />', () => {
    function setMockPrefersReducedMotion(prefersReducedMotion: boolean) {
        mockedUsePrefersReducedMotion.mockImplementation(() => prefersReducedMotion);
    }

    function setMockShowFps(shouldShowFps: boolean) {
        mockedNextNavigation.useSearchParams.mockReturnValue(
            {
                get: (key: string) => key === 'fps' ? (shouldShowFps ? 'true' : '') : null
            } as nextNavigation.ReadonlyURLSearchParams
        );
    }

    beforeEach(() => {
        setupJestCanvasMock();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should show the FPS meter if it is in the query param', () => {
        setMockPrefersReducedMotion(false);
        setMockShowFps(true);

        render(<Starfield />);

        const fpsMeter = screen.queryByTestId('starfield-fps-meter');
        expect(fpsMeter).toBeInTheDocument();
    });

    it('should not show the FPS meter if it is not in the query param', () => {
        setMockPrefersReducedMotion(false);
        setMockShowFps(false);

        render(<Starfield />);

        const fpsMeter = screen.queryByTestId('starfield-fps-meter');
        expect(fpsMeter).not.toBeInTheDocument();
    });

    it('should not animate if user prefers reduced motion', () => {
        setMockPrefersReducedMotion(true);
        setMockShowFps(true);
        const rafSpy = jest.spyOn(window, 'requestAnimationFrame');

        render(<Starfield />);

        // there should be no FPS meter if the user prefers reduced motion
        const fpsMeter = screen.queryByTestId('starfield-fps-meter');
        expect(fpsMeter).not.toBeInTheDocument();

        // there should be no redraw calls after stars have been drawn intially
        expect(rafSpy).not.toHaveBeenCalled();
    });
})

