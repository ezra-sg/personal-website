import throttle from '@/utils/throttle';

describe('throttle', () => {
    it('should correctly throttle a given function', () => {
        const fn = jest.fn();
        const throttledFn = throttle(fn, 1000);

        throttledFn();
        throttledFn();
        throttledFn();

        expect(fn).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1000);

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
