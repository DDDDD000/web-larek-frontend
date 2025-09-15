import { ensureElement } from "../shared/utils";
import { EventEmitter } from "../shared/events";

export class MainPageView {
    private gallery: HTMLElement;
    private basketButton: HTMLElement;
    private basketCounter: HTMLElement;

    constructor(private container: HTMLElement, private events: EventEmitter) {
        this.gallery = ensureElement<HTMLElement>('.gallery', this.container);
        this.basketButton = ensureElement<HTMLElement>('.header__basket', document as unknown as HTMLElement);
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', document as unknown as HTMLElement);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });

        this.events.on('modal:open', this.handleModalOpen.bind(this));
        this.events.on('modal:close', this.handleModalClose.bind(this));
    }

    private handleModalOpen() {
        document.body.classList.add('modal_no-scroll');
    }

    private handleModalClose() {
        document.body.classList.remove('modal_no-scroll');
    }

    render(cards: HTMLElement[]) {
        this.gallery.replaceChildren(...cards);
    }

    setCounter(count: number) {
        this.basketCounter.textContent = String(count);
    }

}
