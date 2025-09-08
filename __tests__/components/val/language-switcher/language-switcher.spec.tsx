import { RenderResult, fireEvent } from '@testing-library/react';
import { act } from 'react';

import LanguageSwitcher from '@/components/val/language-switcher/language-switcher';
import { renderWithLanguage } from '@/__tests__/testing-helpers';

describe('LanguageSwitcher', () => {
    const getMenuElement = (result: RenderResult) => result.queryByTestId('language-switcher-popup');

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render correctly', () => {
        const result = renderWithLanguage(<LanguageSwitcher />);
        expect(result.container).toMatchSnapshot();
    });

    it('should toggle the menu visibility when the switcher button is clicked', () => {
        const result = renderWithLanguage(<LanguageSwitcher />);

        const button = result.queryByTestId('language-switcher-button');
        expect(button).toBeInTheDocument();

        // the menu should be hidden by default
        let menu = getMenuElement(result);
        expect(menu).toHaveAttribute('hidden');

        // click the button to open the menu
        act(() => {
            fireEvent.click(button!);
        });

        // the menu should be visible
        expect(menu).not.toHaveAttribute('hidden');

        // click the button again to close the menu
        act(() => {
            fireEvent.click(button!);
        });

        // the menu should be hidden
        expect(menu).toHaveAttribute('hidden');
    });

    it('should hide the menu when the user clicks away', async () => {
        jest.spyOn(document, 'addEventListener');
        jest.spyOn(document, 'removeEventListener');

        const result = renderWithLanguage(<LanguageSwitcher />);

        // addEventListener is being called with 'selectionchage' for some reason not related to the code, perhaps
        // a bug in the testing library. it needs to be reset to 0 before the assertions
        (document.addEventListener as jest.Mock).mockReset();

        const button = result.queryByTestId('language-switcher-button');
        expect(button).toBeInTheDocument();

        // event listener should only be added when the menu is open
        expect(document.addEventListener).toHaveBeenCalledTimes(0);

        // the menu should be hidden by default
        let menu = getMenuElement(result);
        expect(menu).toHaveAttribute('hidden');

        // open the menu
        act(() => {
            fireEvent.click(button!);
        });

        // the menu should be visible
        expect(menu).not.toHaveAttribute('hidden');
        expect(document.addEventListener).toHaveBeenCalledTimes(1);
        expect(document.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
        const clickawayHandler = (document.addEventListener as jest.Mock).mock.calls[0][1];

        act(() => {
            // fireEvent/userEvent.click on the document doesn't trigger event handlers
            // so we need to call the handler directly to simulate a click outside the menu
            clickawayHandler({ target: document.body });
        });

        // the menu should be hidden on clickaway
        expect(menu).toHaveAttribute('hidden');
        expect(document.removeEventListener).toHaveBeenCalledTimes(1);
        expect(document.removeEventListener).toHaveBeenCalledWith('mousedown', clickawayHandler);
    });
});
