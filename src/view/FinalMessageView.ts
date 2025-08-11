import { ensureElement } from "../shared/utils";
import { IEvents } from "../shared/events";

interface IFinal {
    total: number;
}

export class FinalMessageView {
    private template: HTMLTemplateElement;
    private events: IEvents;

    constructor(private container: HTMLElement, events: IEvents) {
        this.events = events;
        this.template = ensureElement<HTMLTemplateElement>('#success');
    }

    render(data: IFinal): HTMLElement {
        const clone = this.template.content.cloneNode(true) as DocumentFragment;
        const root = clone.firstElementChild as HTMLElement;

        const desc = clone.querySelector('.order-success__description') as HTMLElement;
        const closeBtn = clone.querySelector('.order-success__close') as HTMLButtonElement;

        if (desc) desc.textContent = `Списано ${data.total} синапсов`;

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.events.emit('success:close');
            });
        }

        return root;
    }
}
