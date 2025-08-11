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
    }

    render(cards: HTMLElement[]) {
        this.gallery.replaceChildren(...cards);
    }

    setCounter(count: number) {
        this.basketCounter.textContent = String(count);
    }
}
