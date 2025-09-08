import { renderHook } from '@testing-library/react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { act } from 'react';

describe('usePrefersReducedMotion', () => {
    let savedMatchMedia: ((query: string) => MediaQueryList);
    const matchMediaMock = jest.fn();

    let changeListener: (event: { matches: boolean }) => void;
    const addEventListenerMock = jest.fn().mockImplementation(
        (eventName: string, listener: () => void) => {
            changeListener = listener;
        }
    );
    const removeEventListenerMock = jest.fn();

    function setMockPrefersReducedMotion(prefersReducedMotion: boolean) {
        matchMediaMock.mockImplementation(() => ({
            matches: prefersReducedMotion,
            addEventListener: addEventListenerMock,
            removeEventListener: removeEventListenerMock,
        }));
    }

    beforeAll(() => {
        savedMatchMedia = global.window.matchMedia;
        global.window.matchMedia = matchMediaMock;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        // restore the original matchMedia
        global.window.matchMedia = savedMatchMedia;
    });

    it('should return the correct value given the user\'s motion preference', () => {
        setMockPrefersReducedMotion(true);
        const { result, unmount } = renderHook(() => usePrefersReducedMotion());

        expect(result.current).toBe(true);
        expect(addEventListenerMock).toHaveBeenCalledTimes(1);

        act(() => {
            setMockPrefersReducedMotion(false);
            changeListener({ matches: false });
        });
        expect(result.current).toBe(false);

        unmount();
        expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
        expect(removeEventListenerMock).toHaveBeenCalledWith('change', changeListener);
    });
});
