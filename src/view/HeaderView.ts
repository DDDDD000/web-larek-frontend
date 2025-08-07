import { EventEmitter } from "../shared/events";
import { ensureElement } from "../shared/utils";

export class HeaderView {
    protected _basketButton: HTMLButtonElement

    constructor(container: HTMLElement, private events: EventEmitter) {
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }
}