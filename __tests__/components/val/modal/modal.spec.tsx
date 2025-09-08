import { renderWithLanguage } from '@/__tests__/testing-helpers';

import Modal from '@/components/val/modal/modal';
import { act, fireEvent } from '@testing-library/react';


jest.mock('react-icons/md', () => ({
    MdClose: () => <div>x icon</div>,
}));

describe('Modal', () => {
    const closeDialogSpy = jest.fn();
    const openDialogSpy = jest.fn();
    const modalNode = (
        <Modal
            description="description text"
            title="title text"
            subtitle="subtitle text"
            trigger={<button>trigger text</button>}
        >
            <div>children text</div>
        </Modal>
    );

    afterEach(() => {
        jest.restoreAllMocks();
    });

    beforeAll(() => {
        // address error "Not implemented: HTMLDialogElement.prototype.[close/showModal]"
        window.HTMLDialogElement.prototype.close = closeDialogSpy;
        window.HTMLDialogElement.prototype.showModal = openDialogSpy;
    });

    it('should render properly', () => {
        jest.spyOn(document, 'addEventListener');
        jest.spyOn(document, 'removeEventListener');
        const result = renderWithLanguage(modalNode);
        // addEventListener is being called with 'selectionchage' for some reason not related to the code, perhaps
        // a bug in the testing library. it needs to be reset to 0 before the assertions
        (document.addEventListener as jest.Mock).mockReset();

        expect(result.container).toMatchSnapshot();
        expect(document.addEventListener).not.toHaveBeenCalled();
        expect(document.removeEventListener).not.toHaveBeenCalled();
        expect(openDialogSpy).toHaveBeenCalledTimes(0);
        expect(closeDialogSpy).toHaveBeenCalledTimes(1); // called once on initial render in useEffect > modalIsVisible
        expect(document.body.style).toMatchObject(expect.objectContaining({
            overflow: '',
            filter: '',
        }));
        expect(document.body.getAttribute('inert')).toBeFalsy();

        const triggerElement = result.queryByTestId('modal-trigger');
        expect(triggerElement).toBeInTheDocument();

        // another mysterious case of listeners being added unrelated to the component code-- in this case, it's "mouseover" and "mouseout"
        // so we need to reset the mocks again
        (document.addEventListener as jest.Mock).mockReset();

        // open the modal
        // note that in the browser environment, the HTMLElementDialog.prototype.showModal() method
        // handles the opening of the modal but it doesn't change the markup at all. Thus in the test environment,
        // there is no direct indication that the modal is open. We can, however, check the side effects
        act(() => {
            fireEvent.click(triggerElement!);
        });

        expect(openDialogSpy).toHaveBeenCalledTimes(1);
        expect(closeDialogSpy).toHaveBeenCalledTimes(1);
        expect(document.addEventListener).toHaveBeenCalledTimes(2);
        const clickawayHandler = (document.addEventListener as jest.Mock).mock.calls[0][1];
        const tabFocusTrapHandler = (document.addEventListener as jest.Mock).mock.calls[1][1];
        expect(document.addEventListener).toHaveBeenCalledWith('mousedown', clickawayHandler);
        expect(document.addEventListener).toHaveBeenCalledWith('keydown', tabFocusTrapHandler);
        expect(document.removeEventListener).not.toHaveBeenCalled();

        expect(document.body.style).toMatchObject(expect.objectContaining({
            overflow: 'hidden',
            filter: 'blur(2px)',
        }));
        expect(document.body.getAttribute('inert')).toBe('true');

        const closeButton = result.queryByTestId('modal-close-button');
        expect(closeButton).toBeInTheDocument();

        // close the modal by clicking the X icon
        act(() => {
            fireEvent.click(closeButton!);
        });

        expect(document.addEventListener).toHaveBeenCalledTimes(2); // unchanged
        expect(document.removeEventListener).toHaveBeenCalledTimes(2);
        expect(document.removeEventListener).toHaveBeenNthCalledWith(1, 'mousedown', clickawayHandler);
        expect(document.removeEventListener).toHaveBeenNthCalledWith(2, 'keydown', tabFocusTrapHandler);
        expect(openDialogSpy).toHaveBeenCalledTimes(1);
        expect(closeDialogSpy).toHaveBeenCalledTimes(2); // called again
        expect(document.body.style).toMatchObject(expect.objectContaining({
            overflow: '',
            filter: '',
        }));
        expect(document.body.getAttribute('inert')).toBeFalsy();
    });

    it('should close on clickaway', () => {
        jest.spyOn(document, 'addEventListener');

        const result = renderWithLanguage(modalNode);
        const triggerElement = result.queryByTestId('modal-trigger');
        expect(triggerElement).toBeInTheDocument();

        // open the modal
        act(() => {
            fireEvent.click(triggerElement!);
        });

        const clickawayHandler = (document.addEventListener as jest.Mock).mock.calls[0][1];

        // simulate a click outside the modal
        act(() => {
            clickawayHandler(new KeyboardEvent('mousedown'));
        });

        expect(document.body.style).toMatchObject(expect.objectContaining({
            overflow: '',
            filter: '',
        }));
        expect(document.body.getAttribute('inert')).toBeFalsy();
    });
});
