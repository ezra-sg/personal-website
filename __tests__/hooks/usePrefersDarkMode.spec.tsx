import { renderHook } from '@testing-library/react';
import usePrefersDarkMode from '@/hooks/usePrefersDarkMode';
import { act } from 'react';

describe('usePrefersDarkMode', () => {
    let savedMatchMedia: ((query: string) => MediaQueryList);
    const matchMediaMock = jest.fn();

    let changeListener: (event: { matches: boolean }) => void;
    const addEventListenerMock = jest.fn().mockImplementation(
        (eventName: string, listener: () => void) => {
            changeListener = listener;
        }
    );
    const removeEventListenerMock = jest.fn();

    function setMockPrefersDarkMode(prefersDarkMode: boolean) {
        matchMediaMock.mockImplementation(() => ({
            matches: prefersDarkMode,
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

    it('should return the correct value given the user\'s theme preference', () => {
        setMockPrefersDarkMode(true);
        const { result, unmount } = renderHook(() => usePrefersDarkMode());

        expect(result.current).toBe(true);
        expect(addEventListenerMock).toHaveBeenCalledTimes(1);

        act(() => {
            setMockPrefersDarkMode(false);
            changeListener({ matches: false });
        });
        expect(result.current).toBe(false);

        unmount();
        expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
        expect(removeEventListenerMock).toHaveBeenCalledWith('change', changeListener);
    });
});
